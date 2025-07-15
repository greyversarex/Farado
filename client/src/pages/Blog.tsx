import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/simple-i18n";
import { PageBanner } from "@/components/ui/page-banner";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  featuredImage?: string;
  createdAt: string;
  created_at?: string;
  excerpt?: string;
}

export default function Blog() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const categories = [
    { key: "all", label: "Все" },
    { key: "логистика", label: "Логистика" },
    { key: "бизнес", label: "Бизнес" },
    { key: "таможня", label: "Таможня" },
    { key: "аналитика", label: "Аналитика" }
  ];
  
  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter((post: BlogPost) => post.category?.toLowerCase() === selectedCategory.toLowerCase());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  // Single post view
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="outline" 
            onClick={() => setSelectedPost(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к блогу
          </Button>
          
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <img 
                src={selectedPost.featuredImage} 
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="outline">{selectedPost.category}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {(selectedPost.created_at || selectedPost.createdAt) ? 
                    new Date(selectedPost.created_at || selectedPost.createdAt || '').toLocaleDateString('ru-RU') : 
                    'Неизвестная дата'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  5 мин чтения
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {selectedPost.title}
              </h1>
              
              <div className="text-lg text-gray-600 mb-8 leading-relaxed">
                {selectedPost.excerpt}
              </div>
              
              <div className="prose prose-lg max-w-none">
                {selectedPost.content.split('\n').map((line: string, index: number) => {
                  // Skip empty lines
                  if (line.trim() === '') {
                    return <br key={index} />;
                  }
                  
                  // Main headings (##)
                  if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">{line.substring(3)}</h2>;
                  }
                  
                  // Sub headings (###)
                  if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-900">{line.substring(4)}</h3>;
                  }
                  
                  // List items with dash
                  if (line.startsWith('- ')) {
                    return <li key={index} className="ml-6 mb-2 list-disc text-gray-700">{line.substring(2)}</li>;
                  }
                  
                  // Numbered list items
                  if (line.match(/^\d+\. /)) {
                    return <li key={index} className="ml-6 mb-2 list-decimal text-gray-700">{line.replace(/^\d+\. /, '')}</li>;
                  }
                  
                  // Bold text in lists or paragraphs
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={index} className="mb-4 leading-relaxed text-gray-700">
                        {parts.map((part, i) => 
                          i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  
                  // Regular paragraphs
                  return <p key={index} className="mb-4 leading-relaxed text-gray-700">{line}</p>;
                })}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Blog list view
  return (
    <div className="min-h-screen">
      {/* Page Banner */}
      <PageBanner 
        title="Блог"
        subtitle="Экспертные статьи о логистике, торговле с Китаем и международных перевозках"
      />
      
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.key)}
              className="capitalize"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: any) => (
              <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => setSelectedPost(post)}>
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-red-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      5 мин чтения
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:text-red-600">
                      Читать <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Статьи не найдены</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}