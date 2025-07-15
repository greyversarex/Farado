import { useState } from "react";
import { useSimpleTranslation } from "@/lib/translations";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageBanner } from "@/components/ui/page-banner";
import { 
  Package, 
  Search,
  Truck, 
  FileText, 
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function ClientPortal() {
  const { t } = useSimpleTranslation();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>("");

  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;
    
    setIsSearching(true);
    setSearchError("");
    setSearchResults(null);
    
    try {
      // Try the enhanced search endpoint
      const response = await fetch(`/api/search/orders/${trackingNumber}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          // Direct order found
          setSearchResults(data);
          setSearchError("");
        } else if (data.order) {
          // Order wrapped in object
          setSearchResults(data.order);
          setSearchError("");
        } else {
          // No order found
          setSearchResults(null);
          setSearchError("Данного заказа не существует");
        }
      } else if (response.status === 404) {
        setSearchResults(null);
        setSearchError("Данного заказа не существует");
      } else {
        setSearchResults(null);
        setSearchError("Ошибка при поиске заказа");
      }
    } catch (error) {
      setSearchResults(null);
      setSearchError("Ошибка сети. Попробуйте позже");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing": return "bg-yellow-500";
      case "shipped": return "bg-blue-500";
      case "in_transit": return "bg-orange-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing": return t('pages.clientPortal.status.processing');
      case "shipped": return t('pages.clientPortal.status.shipped');
      case "in_transit": return t('pages.clientPortal.status.inTransit');
      case "delivered": return t('pages.clientPortal.status.delivered');
      case "cancelled": return t('pages.clientPortal.status.cancelled');
      default: return status;
    }
  };

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t('pages.clientPortal.title')}
        subtitle={t('pages.clientPortal.subtitle')}
      />
      
      <div className="py-8 bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('pages.clientPortal.trackOrder')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="tracking">{t('pages.clientPortal.trackingNumber')}</Label>
                  <Input
                    id="tracking"
                    placeholder="FAR-2024-001"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching || !trackingNumber.trim()}
                  >
                    {isSearching ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        {t('pages.clientPortal.searching')}
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        {t('pages.clientPortal.search')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {searchError && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{searchError}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {searchResults && !searchError && (
            <div className="space-y-6">
              {/* Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {t('pages.clientPortal.orderInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{searchResults.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Номер заказа: {searchResults.code}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Откуда:</strong> Китай
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>Куда:</strong> Душанбе, Таджикистан
                          </span>
                        </div>

                      </div>
                    </div>
                    
                    <div>
                      <div className="text-center">
                        <Badge className={`${getStatusColor(searchResults.status)} text-white mb-4`}>
                          {searchResults.status === "Active" ? "В пути" : "Завершен"}
                        </Badge>
                        
                        <div className="flex justify-center">
                          {searchResults.status === "Active" && <Truck className="h-12 w-12 text-orange-500" />}
                          {searchResults.status === "Completed" && <CheckCircle className="h-12 w-12 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('pages.clientPortal.orderHistory')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.items && searchResults.items.length > 0 ? (
                      searchResults.items.map((item: any, index: number) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${item.status === "На складе" ? "bg-yellow-500" : 
                              item.status === "Отправлено" ? "bg-blue-500" : 
                              item.status === "Доставлено" ? "bg-green-500" : "bg-gray-500"}`} />
                            {index < searchResults.items.length - 1 && (
                              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{item.status}</span>
                              <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString('ru-RU')}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {item.name}
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              <span>Количество: {item.quantity}</span>
                              {item.weight && item.volumeType === 'kg' && (
                                <span>Вес: {parseFloat(item.weight).toString()} кг</span>
                              )}
                              {item.volume && item.volumeType === 'm³' && (
                                <span>Объем: {parseFloat(item.volume).toString()} м³</span>
                              )}
                              {item.warehouseName && (
                                <span>{item.warehouseName}</span>
                              )}
                              {item.expectedDeliveryDate && (
                                <span>Ожидаемая доставка: {new Date(item.expectedDeliveryDate).toLocaleDateString('ru-RU')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">В обработке</span>
                            <span className="text-sm text-gray-500">{new Date(searchResults.createdAt).toLocaleDateString('ru-RU')}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Заказ принят в обработку
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t('pages.clientPortal.needHelp')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('pages.clientPortal.helpDescription')}
              </p>
              <div className="flex gap-4">
                <Link href="/contact">
                  <Button variant="outline">
                    {t('pages.clientPortal.contactUs')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}