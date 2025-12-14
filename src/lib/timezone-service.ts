// // TimeZoneService: API-backed + Intl-based replacement for moment-timezone
// // Provides compatibility helpers used across the app.

// export interface TimeZoneOption {
//   id: string;          // مثال: "Europe/Vaduz"
//   label: string;       // "Europe/Vaduz" أو لقب أكثر قراءة
//   offset?: string;     // "+01:00" متى أمكن
//   countryCode?: string;
// }

// export class TimeZoneService {
//   private static cache: TimeZoneOption[] | null = null;

//   // Helper: try to read timezones from Intl if available (client-side)
//   private static getTimeZonesFromIntl(): string[] {
//     try {
//       // supportedValuesOf is available in modern browsers/Node
//       const fn = (Intl as any).supportedValuesOf;
//       if (typeof fn === 'function') {
//         return fn('timeZone') as string[];
//       }
//     } catch (e) {
//       // ignore
//     }

//     // Fallback empty array (caller should use API fallback)
//     return [];
//   }

//   // Parse GMT offset from Intl formatted parts (returns +HH:MM or empty)
//   private static parseGmtOffset(zone: string, date?: Date): string {
//     try {
//       const dt = date || new Date();
//       const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' }).formatToParts(dt);
//       const tzPart = parts.find((p: any) => p.type === 'timeZoneName')?.value || '';
//       // tzPart often looks like "GMT+3" or "GMT+03:00" or "GMT"
//       const m = /GMT\s*([+-]?\d{1,2})(?::?(\d{2}))?/.exec(tzPart.replace(/\s+/g, '')) || /GMT([+-]\d{1,2})(?::(\d{2}))?/.exec(tzPart);
//       if (m) {
//         const sign = m[1].startsWith('-') ? '-' : '+';
//         const hh = String(Math.abs(parseInt(m[1], 10))).padStart(2, '0');
//         const mm = m[2] ? String(m[2]).padStart(2, '0') : '00';
//         return `${sign}${hh}:${mm}`;
//       }
//     } catch (e) {
//       // ignore
//     }
//     return '';
//   }

//   // Public: fetch timezones from remote API
//   static async getTimeZonesFromAPI(apiBaseUrl?: string): Promise<TimeZoneOption[]> {
//     const base = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || '';
//     const url = base ? `${base.replace(/\/$/, '')}/api/customer/show/timezone` : `/api/customer/show/timezone`;

//     try {
//       const res = await fetch(url);
//       if (!res.ok) throw new Error('Failed to load timezones from API');
//       const payload = await res.json();
//       const list = Array.isArray(payload?.data) ? payload.data : [];

//       const zones: TimeZoneOption[] = list.map((z: string) => ({
//         id: z,
//         label: z.split('/').pop()?.replace(/_/g, ' ') || z,
//         offset: this.parseGmtOffset(z)
//       }));

//       this.cache = zones;
//       return zones;
//     } catch (err) {
//       // propagate error to caller so they can fallback
//       throw err;
//     }
//   }

//   // Fallback generator: create list from Intl.supportedValuesOf if available
//   static getFallbackTimeZones(): TimeZoneOption[] {
//     if (this.cache) return this.cache;
//     const names = this.getTimeZonesFromIntl();
//     const zones = names.map((z) => ({ id: z, label: z.split('/').pop()?.replace(/_/g, ' ') || z, offset: this.parseGmtOffset(z) }));
//     this.cache = zones;
//     return zones;
//   }

//   // Compatibility: original code expected synchronous getAllTimeZones()
//   // Return cached values or fallback list; callers that need fresh data should call getTimeZonesFromAPI()
//   static getAllTimeZones(): TimeZoneOption[] {
//     if (this.cache) return this.cache;
//     const fallback = this.getFallbackTimeZones();
//     return fallback;
//   }

//   // Detect user timezone using Intl (equivalent to moment.tz.guess())
//   static detectUserTimeZone(): string {
//     try {
//       return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
//     } catch (e) {
//       return 'UTC';
//     }
//   }

//   // Validate timezone identifier
//   static isValidTimeZone(zone: string): boolean {
//     try {
//       // Intl will throw for invalid timeZone in some engines
//       Intl.DateTimeFormat(undefined as any, { timeZone: zone });
//       return true;
//     } catch (e) {
//       return false;
//     }
//   }

//   // Provide the alternative casing some code uses
//   static isValidTimezone(zone: string) {
//     return this.isValidTimeZone(zone);
//   }

//   // Convert a time string (e.g. "14:30" or "14:30:00" or full datetime) from one zone to another
//   // date parameter supplies the date context (required for DST correctness)
//   static convertTimeBetweenZones(time: string, fromZone: string, toZone: string, date?: Date): string {
//     // ensure date context
//     const ctx = date ? new Date(date) : new Date();

//     // parse time
//     const timeParts = time.split(':').map((s) => parseInt(s, 10));
//     const hour = isNaN(timeParts[0]) ? 0 : timeParts[0];
//     const minute = isNaN(timeParts[1]) ? 0 : timeParts[1];
//     const second = isNaN(timeParts[2]) ? 0 : timeParts[2] || 0;

//     // Build a UTC timestamp for the given local time in fromZone by compensating its offset
//     // Get offsets in minutes for both zones at the provided date
//     const offsetFrom = this.getOffsetMinutes(fromZone, ctx);
//     const offsetTo = this.getOffsetMinutes(toZone, ctx);

//     // UTC milliseconds for local-from time = Date.UTC(...) - offsetFrom*60000
//     const utcMs = Date.UTC(ctx.getFullYear(), ctx.getMonth(), ctx.getDate(), hour, minute, second) - offsetFrom * 60000;

//     // Now create Date for that instant and format in target timezone
//     const instant = new Date(utcMs);

//     const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: toZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
//     // result like "14:30:00" or "14:30:00"
//     const parts = fmt.formatToParts(instant);
//     const h = parts.find(p => p.type === 'hour')?.value || '00';
//     const m = parts.find(p => p.type === 'minute')?.value || '00';
//     const s = parts.find(p => p.type === 'second')?.value || '00';
//     return `${h}:${m}:${s}`;
//   }

//   // Helper: get offset in minutes for a timezone at a given date (positive = ahead of UTC)
//   private static getOffsetMinutes(zone: string, date: Date): number {
//     try {
//       const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' }).formatToParts(date);
//       const tzPart = parts.find((p: any) => p.type === 'timeZoneName')?.value || '';
//       const m = /GMT\s*([+-]?\d{1,2})(?::?(\d{2}))?/.exec(tzPart.replace(/\s+/g, '')) || /GMT([+-]\d{1,2})(?::(\d{2}))?/.exec(tzPart);
//       if (m) {
//         const hours = parseInt(m[1], 10);
//         const mins = m[2] ? parseInt(m[2], 10) : 0;
//         return hours * 60 + (hours >= 0 ? mins : -mins);
//       }
//     } catch (e) {
//       // ignore
//     }
//     return 0;
//   }

//   // Format date/time in a target timezone. Supports some common patterns used in the app.
//   static formatDateTime(date: Date, format: string, timeZone: string): string {
//     try {
//       const dt = date || new Date();
//       if (/YYYY[-]MM[-]DD[T]HH:mm:ss/i.test(format)) {
//         // produce ISO-like string in target tz
//         const parts = new Intl.DateTimeFormat('en-GB', {
//           timeZone,
//           year: 'numeric', month: '2-digit', day: '2-digit',
//           hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
//         }).formatToParts(dt);
//         const map: any = {};
//         parts.forEach((p: any) => { if (p.type && p.value) map[p.type] = p.value; });
//         return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;
//       }

//       if (/dd MMMM yyyy/.test(format)) {
//         // example: 05 January 2024 (localized using Arabic if available)
//         return new Intl.DateTimeFormat('ar', { timeZone, day: '2-digit', month: 'long', year: 'numeric' }).format(dt as Date);
//       }

//       // fallback: locale string in target tz
//       return new Intl.DateTimeFormat(undefined, { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(dt as Date);
//     } catch (e) {
//       return date.toString();
//     }
//   }

// }



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