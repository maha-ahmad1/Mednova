"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SearchIcon,
  Award,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { ProviderCard } from "./ProviderCard";
import { SearchFilters, ProviderType } from "../types/provider";
import { FiltersSidebar } from "./FiltersSidebar";
import { useServiceProviders } from "../hooks/useServiceProviders";
import { useMedicalSpecialties } from "../hooks/useMedicalSpecialties";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import { useTranslations,useLocale } from "next-intl"; // استيراد أدوات الترجمة

export default function TherapistsAndCenters() {
  const t = useTranslations("specialists"); // استخدام قسم specialists من الـ JSON
   const tCommon = useTranslations("common"); // استخدام الكلمات العامة مثل "خطأ"
   const locale = useLocale();
  
  const [selectedTab, setSelectedTab] = useState<ProviderType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(12);
  const [filters, setFilters] = useState<SearchFilters>({
    country: "",
    city: "",
    specialty: "",
  });

  const { data: session } = useSession();
  const { data: specialtiesData } = useMedicalSpecialties();
  const {
    data: providersData,
    isLoading,
    error,
  } = useServiceProviders(selectedTab, {
    full_name: debouncedSearch,
    country: filters.country,
    city: filters.city,
    specialty: filters.specialty,
    limit,
  });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ country: "", city: "", specialty: "" });
    setSearchQuery("");
    setLimit(12);
  };

  const providers = providersData || [];
  const handleLoadMore = () => setLimit((prev) => prev + 6);

  return (
    <>
      <Navbar variant="landing" />
    
      {/* ترجمة نصوص التنقل */}
      <BreadcrumbNav currentPage={t("title")} />

      <section className="bg-[#F8F7F7] py-8 px-5 md:px-16 lg:px-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <FiltersSidebar
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              specialties={specialtiesData || []}
            />

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                <div className="relative">
                  {/* تعديل مكان الأيقونة حسب اللغة */}
                  <SearchIcon className={`absolute ${locale === 'ar' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("search")} // نص البحث من الـ JSON
                    className={`w-full h-14 text-lg ${locale === 'ar' ? 'px-12 text-right' : 'px-12 text-left'} rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D]`}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
                        <Skeleton className="h-48 w-full rounded-xl mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                      <h3 className="text-lg font-semibold text-red-800 mb-2">{tCommon("error")}</h3>
                      <Button variant="outline" onClick={() => window.location.reload()}>{tCommon("tryAgain")}</Button>
                    </div>
                  </div>
                ) : providers.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("notFound")}</h3>
                    <Button onClick={clearFilters} className="bg-[#32A88D]">{t("filter")}</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {providers.map((provider) => (
                      <ProviderCard key={provider.id} provider={provider} />
                    ))}
                  </div>
                )}

                {providers.length > 0 && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      className="border-[#32A88D] text-[#32A88D] rounded-xl px-8 py-2"
                      onClick={handleLoadMore}
                    >
                      {tCommon("next")} {/* أو يمكنك إضافة مفتاح "loadMore" في الـ JSON */}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}