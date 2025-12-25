"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SearchIcon,
  HomeIcon,
  ArrowRight,
  FilterIcon,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ProviderCard } from "./ProviderCard";
import { SearchFilters, ProviderType } from "../types/provider";
import { FiltersSidebar } from "./FiltersSidebar";
import LandingNavbar from "@/shared/ui/layout/LandingNavbar";
import { useServiceProviders } from "../hooks/useServiceProviders";
import { useMedicalSpecialties } from "../hooks/useMedicalSpecialties";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";

export default function TherapistsAndCenters() {
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

  // Use the custom hooks
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

  console.log("providersData", providersData);
  console.log("Selected Tab:", selectedTab);
  console.log("Providers Data:", providersData);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      country: "",
      city: "",
      specialty: "",
    });
    setSearchQuery("");
    setLimit(12);
  };

  const resultsCount = providersData?.length || 0;
  const providers = providersData || [];

  const handleLoadMore = () => {
    setLimit((prev) => prev + 6);
  };
  return (
    <>
      <LandingNavbar />

   
      <BreadcrumbNav currentPage="المختصين والمراكز" />

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
                  <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن المختصين والمراكز التأهيلية..."
                    className="w-full h-14 text-lg px-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#32A88D] focus:border-[#32A88D]"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse"
                      >
                        <Skeleton className="h-48 w-full rounded-xl mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-red-800 mb-2">
                        حدث خطأ
                      </h3>
                      <p className="text-red-600">تعذر تحميل بيانات المختصين</p>
                      <Button
                        variant="outline"
                        className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => window.location.reload()}
                      >
                        إعادة المحاولة
                      </Button>
                    </div>
                  </div>
                ) : providers.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <SearchIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      لا توجد نتائج
                    </h3>
                    <p className="text-gray-600 mb-6">
                      لم نتمكن من العثور على أي نتائج تطابق بحثك
                    </p>
                    <Button
                      onClick={clearFilters}
                      className="bg-[#32A88D] hover:bg-[#2a8a7a]"
                    >
                      مسح الفلاتر
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {providers.map((provider) => (
                      <ProviderCard key={provider.id} provider={provider} />
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {providers.length > 0 && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      className="border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10 rounded-xl px-8 py-2"
                      onClick={handleLoadMore}
                    >
                      تحميل المزيد
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
