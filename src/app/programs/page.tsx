"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { 
  Star, 
  Clock, 
  Calendar, 
  Users, 
  Search, 
  Filter, 
  ChevronDown,
  Grid,
  List,
  Heart,
  Eye,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/shared/ui/components/Navbar/Navbar";
import BreadcrumbNav from "@/shared/ui/components/BreadcrumbNav";


type Program = {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  category: string;
  difficulty: "مبتدئ" | "متوسط" | "متقدم";
  duration: string;
  sessions: number;
  ratings_avg_rating: string;
  total_reviews: number;
  average_rating: number;
  is_featured?: boolean;
  is_new?: boolean;
  enrolled_count: number;
  tags: string[];
};

export default function ProgramsListPage() {
  const { data: session, status } = useSession();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("الكل");
  const [sortBy, setSortBy] = useState<string>("الأكثر طلباً");

  const { data, isLoading, error } = useQuery({
    queryKey: ["getAllPrograms"],
    queryFn: async () => {
      try {
        const token = session?.accessToken;
        const res = await axios.get(
          "https://mednovacare.com/api/programs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return res.data;
      } catch (err) {
        console.error("Error fetching programs:", err);
        throw err;
      }
    },
    enabled: status === "authenticated",
  });

  // تصفية البيانات
  const filteredPrograms = data?.data?.filter((program: Program) => {
    const matchesSearch = program.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      program.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      program.tags?.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory = selectedCategory === "الكل" || 
      program.category === selectedCategory;

    const matchesDifficulty = selectedDifficulty === "الكل" || 
      program.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  }) || [];

  // تصنيف البيانات
  const sortedPrograms = [...filteredPrograms].sort((a, b) => {
    switch (sortBy) {
      case "الأكثر طلباً":
        return b.enrolled_count - a.enrolled_count;
      case "الأعلى تقييماً":
        return parseFloat(b.ratings_avg_rating) - parseFloat(a.ratings_avg_rating);
      case "الأحدث":
        return b.id - a.id;
      case "الأقل سعراً":
        return a.price - b.price;
      case "الأعلى سعراً":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const categories = ["الكل", "إعادة تأهيل رياضية", "علاج طبيعي", "تأهيل ما بعد العمليات", "تمارين منزلية"];
  const difficulties = ["الكل", "مبتدئ", "متوسط", "متقدم"];
  const sortOptions = [
    "الأكثر طلباً",
    "الأعلى تقييماً",
    "الأحدث",
    "الأقل سعراً",
    "الأعلى سعراً"
  ];

  if (isLoading) {
    return <ProgramsListSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error State */}
        </div>
      </div>
    );
  }

  return (

    <>
    {/* <Navbar variant="landing" />
  <BreadcrumbNav currentPage="البرامج التأهيلية"/> */}
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      {/* Hero Header */}
      {/* <div className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              البرامج التأهيلية
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              اكتشف مجموعة متنوعة من البرامج التأهيلية المصممة خصيصًا لتحسين صحتك وحركتك
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            {/* Search Bar */}
            <div className="lg:col-span-4">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="ابحث عن برنامج تأهيلي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 rounded-xl border-gray-200 focus:border-[#32A88D] focus:ring-[#32A88D] h-12"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="rounded-xl border-gray-200 h-12">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مستوى الصعوبة
              </label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="rounded-xl border-gray-200 h-12">
                  <SelectValue placeholder="مستوى الصعوبة" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle and Sort */}
            <div className="lg:col-span-2 flex gap-3">
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-none ${viewMode === "grid" ? "bg-[#32A88D] text-white" : ""}`}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`rounded-none ${viewMode === "list" ? "bg-[#32A88D] text-white" : ""}`}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-xl border-gray-200 h-12">
                    <Filter className="ml-2 w-5 h-5" />
                    ترتيب حسب
                    <ChevronDown className="mr-2 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={sortBy === option ? "bg-[#32A88D]/10 text-[#32A88D]" : ""}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {selectedCategory !== "الكل" && (
              <Badge variant="secondary" className="rounded-lg px-3 py-1">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("الكل")}
                  className="mr-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedDifficulty !== "الكل" && (
              <Badge variant="secondary" className="rounded-lg px-3 py-1">
                {selectedDifficulty}
                <button
                  onClick={() => setSelectedDifficulty("الكل")}
                  className="mr-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="rounded-lg px-3 py-1">
                بحث: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="mr-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory("الكل");
                setSelectedDifficulty("الكل");
                setSearchQuery("");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              إزالة جميع الفلاتر
            </Button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            عرض <span className="font-bold text-[#32A88D]">{sortedPrograms.length}</span> برنامج
          </div>
          <div className="text-sm text-gray-500">
            مرتبة حسب: <span className="font-medium text-gray-700">{sortBy}</span>
          </div>
        </div>

        {/* Programs Grid/List */}
        {sortedPrograms.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPrograms.map((program: Program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedPrograms.map((program: Program) => (
                <ProgramListCard key={program.id} program={program} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              لم يتم العثور على برامج
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              لا توجد برامج تطابق معايير البحث الخاصة بك. حاول تغيير الفلاتر أو البحث بمصطلحات أخرى.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("الكل");
                setSelectedDifficulty("الكل");
                setSearchQuery("");
              }}
              className="bg-[#32A88D] hover:bg-[#2a8a7a]"
            >
              عرض جميع البرامج
            </Button>
          </div>
        )}


      </div>
    </div>
    </>
  );
}

// Component for Grid View Card
function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Image
          src={program.image || "/images/home/Sports-rehabilitation.jpg"}
          alt={program.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {program.is_featured && (
            <Badge className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              مميز
            </Badge>
          )}
          {program.is_new && (
            <Badge className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              جديد
            </Badge>
          )}
          <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${
            program.difficulty === "مبتدئ" ? "bg-green-100 text-green-800" :
            program.difficulty === "متوسط" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {program.difficulty}
          </Badge>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {Number(program.ratings_avg_rating).toFixed(1) || "0.0"}
            </span>
            <span className="text-xs opacity-80">({program.total_reviews})</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1">
            {program.title}
          </h3>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {program.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {program.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Program Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-800">{program.duration}</div>
              <div className="text-xs text-gray-500">المدة</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-800">{program.sessions} جلسات</div>
              <div className="text-xs text-gray-500">عدد الجلسات</div>
            </div>
          </div>
        </div>

        {/* Enrolled Count */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Users className="w-4 h-4" />
          <span>{program.enrolled_count} شخص اشترك في هذا البرنامج</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-[#32A88D]">
              ${program.price}
            </div>
            <div className="text-sm text-gray-500">للبرنامج</div>
          </div>
          
          <Button className="cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl px-6 py-2 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Eye className="ml-2 w-4 h-4" />
            عرض التفاصيل
          </Button>
        </div>
      </div>
    </div>
  );
}

// Component for List View Card
function ProgramListCard({ program }: { program: Program }) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="lg:w-1/4 relative">
          <Image
            src={program.image || "/images/home/Sports-rehabilitation.jpg"}
            alt={program.title}
            width={300}
            height={200}
            className="w-full h-48 lg:h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-black/70 text-white backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {program.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-3/4 p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <h3 className="text-xl font-bold text-gray-800 flex-1">
                  {program.title}
                </h3>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {program.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{program.sessions} جلسة</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {Number(program.ratings_avg_rating).toFixed(1)} ({program.total_reviews} تقييم)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{program.enrolled_count} مشترك</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {program.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="rounded-md">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-center gap-4 border-t lg:border-t-0 lg:border-r border-gray-100 pt-4 lg:pt-0 lg:pr-6 lg:pl-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#32A88D]">
                  ${program.price}
                </div>
                <div className="text-sm text-gray-500">للبرنامج</div>
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <Button className="cursor-pointer bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] hover:from-[#2a8a7a] hover:to-[#32A88D] text-white rounded-xl">
                  <Eye className="ml-2 w-4 h-4" />
                  عرض التفاصيل
                </Button>
                <Button variant="outline" className="rounded-xl border-[#32A88D] text-[#32A88D] hover:bg-[#32A88D]/10">
                  سجل الآن
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loading Component
function ProgramsListSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white">
      {/* Hero Skeleton */}
      {/* <div className="bg-gradient-to-r from-[#32A88D] to-[#2a8a7a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-6 w-3/4 mx-auto bg-white/20" />
          </div>
        </div>
      </div> */}

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Skeleton */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="lg:col-span-3">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Programs Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
              <Skeleton className="h-48 w-full rounded-xl mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
   
  );
}