import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// Language system now uses simple global state
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingSocial } from "@/components/ui/floating-social";

// Pages
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Programs from "@/pages/Programs";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import ClientPortal from "@/pages/ClientPortal";
import AdminApp from "@/pages/AdminApp";
import CounterpartyDetails from "@/pages/admin/CounterpartyDetails";
import WarehouseDetails from "@/pages/admin/WarehouseDetails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/admin/counterparty/:id" component={CounterpartyDetails} />
        <Route path="/admin/warehouse/:id" component={WarehouseDetails} />
        <Route path="/admin" component={AdminApp} />
        <Route path="/admin/*" component={AdminApp} />
        <Route path="/*">
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/home" component={Home} />
                <Route path="/services" component={Services} />
                <Route path="/programs" component={Programs} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/blog" component={Blog} />
                <Route path="/client-portal" component={ClientPortal} />
                <Route path="/portal" component={ClientPortal} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
            <FloatingSocial />
          </div>
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
