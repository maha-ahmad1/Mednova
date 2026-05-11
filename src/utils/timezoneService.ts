export interface TimeZoneOption {
  id: string;          // مثال: "Europe/Vaduz"
  label: string;       // اسم معروض للمستخدم
  offset?: string;     // اختياري: "+01:00"
}

export class TimeZoneService {
  private static cache: TimeZoneOption[] | null = null;

  // الحصول على المناطق الزمنية من API فقط
  static async getTimeZonesFromAPI(apiBaseUrl?: string): Promise<TimeZoneOption[]> {
    // استخدام الكاش إذا موجود
    if (this.cache) return this.cache;

    const base = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || '';
    const url = base ? `${base.replace(/\/$/, '')}/api/customer/show/timezone` 
                     : `/api/customer/show/timezone`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load timezones');
      
      const payload = await res.json();
      const zones = Array.isArray(payload?.data) ? payload.data : [];

      // تحويل بسيط
      const options: TimeZoneOption[] = zones.map((zone: string) => ({
        id: zone,
        label: this.formatZoneLabel(zone),
        offset: this.getOffsetForZone(zone) // اختياري
      }));

      this.cache = options;
      return options;

    } catch (error) {
      console.error('Error fetching timezones:', error);
      throw error;
    }
  }

  // تنسيق الاسم لعرضه للمستخدم (بسيط)
  private static formatZoneLabel(zone: string): string {
    const parts = zone.split('/');
    return parts[parts.length - 1].replace(/_/g, ' ');
  }

  // الحصول على الoffset بطريقة أبسط
  private static getOffsetForZone(zone: string): string {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeZoneName: 'shortOffset'
      });
      
      const parts = formatter.formatToParts(now);
      const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value;
      
      if (offsetPart?.includes('GMT')) {
        return offsetPart.replace('GMT', '').trim();
      }
      return '';
    } catch {
      return '';
    }
  }

  // دالة fallback للحصول على المناطق الزمنية (بدون API)
  static getFallbackTimeZones(): TimeZoneOption[] {
    if (this.cache) return this.cache;
    
    try {
      // استخدام Intl للحصول على المناطق الزمنية المتاحة
      const timeZones = Intl.supportedValuesOf('timeZone');
      const zones: TimeZoneOption[] = timeZones.map((zone: string) => ({
        id: zone,
        label: this.formatZoneLabel(zone),
        offset: this.getOffsetForZone(zone)
      }));
      
      this.cache = zones;
      return zones;
    } catch (error) {
      console.error('Error getting fallback timezones:', error);
      // قائمة افتراضية إذا فشل كل شيء
      return [
        { id: 'UTC', label: 'UTC', offset: '+00:00' },
        { id: 'Asia/Riyadh', label: 'Riyadh', offset: '+03:00' },
        { id: 'Europe/London', label: 'London', offset: '+00:00' },
        { id: 'America/New_York', label: 'New York', offset: '-05:00' },
        { id: 'Asia/Dubai', label: 'Dubai', offset: '+04:00' },
        { id: 'Asia/Kolkata', label: 'Kolkata', offset: '+05:30' },
      ];
    }
  }

  // للحصول على كل المناطق الزمنية (مع fallback)
  static async getAllTimeZones(apiBaseUrl?: string): Promise<TimeZoneOption[]> {
    try {
      return await this.getTimeZonesFromAPI(apiBaseUrl);
    } catch (error) {
      console.warn('Using fallback timezones due to API error:', error);
      return this.getFallbackTimeZones();
    }
  }

  // اكتشاف المنطقة الزمنية للمستخدم
  static detectUserTimeZone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  }

  // التحقق من صحة المنطقة الزمنية
  static isValidTimeZone(zone: string): boolean {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: zone });
      return true;
    } catch {
      return false;
    }
  }

  // تحويل الوقت بين المناطق (مبسط باستخدام Date)
  static convertTimeBetweenZones(
    time: string, 
    fromZone: string, 
    toZone: string, 
    date: Date = new Date()
  ): string {
    const [hours, minutes, seconds = '00'] = time.split(':');
    
    // إنشاء تاريخ في المنطقة المصدر
    const sourceDate = new Date(date.toLocaleString('en-US', { timeZone: fromZone }));
    sourceDate.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
    
    // التحويل إلى المنطقة الهدف
    const targetTime = sourceDate.toLocaleTimeString('en-US', { 
      timeZone: toZone, 
      hour12: false 
    });
    
    return targetTime;
  }
}