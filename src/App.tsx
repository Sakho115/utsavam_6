import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LearnMore from "./pages/LearnMore";
import WordSearchGame from "./pages/WordSearchGame";
import MagicalSorter from "./pages/MagicalSorter";
import Registration from "./pages/Registration";
import Register from "./pages/Register";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import Events from "./pages/Events";
import Extras from "./pages/Extras";
import SynonymChallenge from "./components/games/SynonymChallenge";
import SentenceFixer from "./components/games/SentenceFixer";
import GuessTheWord from "./components/games/GuessTheWord";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/extras" element={<Extras />} />
          <Route path="/word-search" element={<WordSearchGame />} />
          <Route path="/magical-sorter" element={<MagicalSorter />} />
          <Route path="/synonym-challenge" element={<SynonymChallenge />} />
          <Route path="/sentence-fixer" element={<SentenceFixer />} />
          <Route path="/guess-the-word" element={<GuessTheWord />} />
          <Route path="/registration" element={<Registration />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
