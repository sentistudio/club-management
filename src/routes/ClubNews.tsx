import { useState, useMemo } from "react";
import { 
  Plus,
  MoreVertical,
  Eye,
  MessageSquare,
  Heart,
  Image as ImageIcon,
  ArrowDownUp,
  Newspaper
} from "lucide-react";
import { Button, Select } from "../components/ui";
import { SearchInput } from "../components/ui/Input";

// Types
interface NewsItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  status: "published" | "draft";
  title: string;
  description: string;
  imageUrl?: string;
  views: number;
  comments: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  clubId?: string;
  teamId?: string;
  tags: string[];
}

// Mock data
const mockNews: NewsItem[] = [
  {
    id: "news_1",
    authorId: "p1",
    authorName: "Patrick Steuble",
    status: "published",
    title: "Essen",
    description: "Create Christmas Day with the Fam",
    imageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=300&fit=crop",
    views: 2,
    comments: 1,
    likes: 1,
    createdAt: "2024-12-20T10:00:00",
    updatedAt: "2024-12-20T10:00:00",
    tags: ["event", "christmas"]
  },
  {
    id: "news_2",
    authorId: "p2",
    authorName: "Elona Kajtazi",
    status: "published",
    title: "test",
    description: "",
    views: 7,
    comments: 0,
    likes: 0,
    createdAt: "2024-12-19T14:00:00",
    updatedAt: "2024-12-19T14:00:00",
    tags: []
  },
  {
    id: "news_3",
    authorId: "p2",
    authorName: "Elona Kajtazi",
    status: "published",
    title: "Breaking News: Underdogs Shock Champions",
    description: "In a night that will be remembered for generations, the modest club FK Aurora...",
    imageUrl: "https://images.unsplash.com/photo-1461896836934- voices-89cd2b5d3a4?w=400&h=300&fit=crop",
    views: 7,
    comments: 0,
    likes: 0,
    createdAt: "2024-12-18T09:00:00",
    updatedAt: "2024-12-18T09:00:00",
    tags: ["news", "match"]
  },
  {
    id: "news_4",
    authorId: "p3",
    authorName: "ELDA 18",
    status: "published",
    title: "Trainingsplan für Januar",
    description: "Der neue Trainingsplan für das neue Jahr ist da. Alle wichtigen Termine im Überblick.",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    views: 15,
    comments: 3,
    likes: 8,
    createdAt: "2024-12-17T16:00:00",
    updatedAt: "2024-12-17T16:00:00",
    tags: ["training", "schedule"]
  },
  {
    id: "news_5",
    authorId: "p1",
    authorName: "Patrick Steuble",
    status: "draft",
    title: "Neujahrsfeier 2025",
    description: "Save the date! Die große Vereinsfeier zum Jahreswechsel...",
    views: 0,
    comments: 0,
    likes: 0,
    createdAt: "2024-12-16T11:00:00",
    updatedAt: "2024-12-16T11:00:00",
    tags: ["event", "party"]
  },
  {
    id: "news_6",
    authorId: "p1",
    authorName: "Patrick Steuble",
    status: "published",
    title: "Spielbericht: Sieg gegen TSV Dortmund-West",
    description: "Mit einem überzeugenden 3:1 Sieg gegen den TSV Dortmund-West haben wir...",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
    views: 42,
    comments: 5,
    likes: 23,
    createdAt: "2024-12-15T20:00:00",
    updatedAt: "2024-12-15T20:00:00",
    tags: ["match", "result"]
  }
];

type StatusFilter = "all" | "published" | "draft";

export function ClubNews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  
  // Combined search (used by the main search)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredNews = useMemo(() => {
    return mockNews
      .filter(news => {
        // Status filter
        if (statusFilter !== "all" && news.status !== statusFilter) return false;
        
        // Search filter
        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          if (!news.title.toLowerCase().includes(search) && 
              !news.description.toLowerCase().includes(search)) {
            return false;
          }
        }
        
        // Author search
        if (authorSearch) {
          if (!news.authorName.toLowerCase().includes(authorSearch.toLowerCase())) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }, [searchTerm, authorSearch, statusFilter, sortBy]);

  const stats = useMemo(() => ({
    total: mockNews.length,
    published: mockNews.filter(n => n.status === "published").length,
    draft: mockNews.filter(n => n.status === "draft").length
  }), []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header with Search */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search news"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create news
        </Button>
      </div>

      {/* Sort */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowDownUp className="w-4 h-4" />
          Sort by: {sortBy === "newest" ? "Newest news" : "Oldest news"}
        </button>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 bg-white rounded-[10px] ring-1 ring-gray-100 shadow-xs overflow-hidden flex flex-col min-h-0">
        {/* Tabs */}
        <div className="border-b border-neutral-200 px-6 pt-4">
          <div className="flex gap-6">
            {[
              { key: "all", label: "All", count: stats.total },
              { key: "published", label: "Published", count: stats.published },
              { key: "draft", label: "Draft", count: stats.draft }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as StatusFilter)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  statusFilter === tab.key
                    ? "text-neutral-900 border-neutral-900"
                    : "text-neutral-500 border-transparent hover:text-neutral-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-48">
              <SearchInput
                placeholder="Search by author name"
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
              />
            </div>
            <Select
              value=""
              onChange={() => {}}
              options={[{ value: "", label: "Clubs" }]}
              className="w-40"
            />
            <Select
              value=""
              onChange={() => {}}
              options={[{ value: "", label: "Teams" }]}
              className="w-40"
            />
            <Select
              value=""
              onChange={() => {}}
              options={[{ value: "", label: "Custom lists" }]}
              className="w-40"
            />
            <Select
              value=""
              onChange={() => {}}
              options={[{ value: "", label: "Tags" }]}
              className="w-32"
            />
          </div>
        </div>

        {/* News Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Newspaper className="w-12 h-12 text-neutral-300 mb-3" />
              <p className="text-neutral-500 mb-1">Keine News gefunden</p>
              <p className="text-sm text-neutral-400">Erstellen Sie Ihre erste Neuigkeit</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white rounded-[10px] ring-1 ring-gray-100 shadow-xs overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-medium text-sm">
                        {news.authorName.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </div>
                      <span className="font-medium text-neutral-900">{news.authorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                        news.status === "published" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          news.status === "published" ? "bg-green-500" : "bg-amber-500"
                        }`} />
                        {news.status === "published" ? "Published" : "Draft"}
                      </span>
                      <button className="p-1 hover:bg-neutral-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="aspect-video bg-neutral-100 relative">
                    {news.imageUrl ? (
                      <img 
                        src={news.imageUrl} 
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-neutral-300" />
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="px-4 py-3 flex items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{news.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{news.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className={`w-4 h-4 ${news.likes > 0 ? "fill-green-500 text-green-500" : ""}`} />
                      <span className={news.likes > 0 ? "text-green-600" : ""}>{news.likes}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-4">
                    <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-1">{news.title}</h3>
                    {news.description && (
                      <p className="text-sm text-neutral-500 line-clamp-2">{news.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

