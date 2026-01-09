import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ShoppingCart, Twitter, Star, MessageCircle, Briefcase, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SampleDataset {
  id: string;
  name: string;
  icon: typeof Database;
  description: string;
  count: number;
  texts: string[];
}

const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'product-reviews',
    name: 'Product Reviews',
    icon: ShoppingCart,
    description: 'E-commerce product feedback',
    count: 10,
    texts: [
      "This product exceeded my expectations! The quality is amazing and it arrived earlier than expected. Highly recommend!",
      "Terrible experience. The item broke after just two days of use. Complete waste of money.",
      "It's okay, nothing special. Does what it's supposed to do but nothing more.",
      "Absolutely love this! Best purchase I've made this year. The customer service was also fantastic.",
      "Not worth the price. There are better alternatives out there for half the cost.",
      "Great value for money. Solid build quality and works perfectly.",
      "Disappointed with the color - looks different from the photos. Otherwise functional.",
      "Five stars! This has made my daily routine so much easier. Can't imagine life without it now.",
      "Arrived damaged and customer support was unhelpful. Very frustrating experience.",
      "Decent product overall. Some minor issues but nothing deal-breaking.",
    ],
  },
  {
    id: 'social-media',
    name: 'Social Media Posts',
    icon: Twitter,
    description: 'Twitter-style posts',
    count: 10,
    texts: [
      "Just had the best coffee of my life! ☕ This new café downtown is a hidden gem! #blessed",
      "Another Monday, another delay on public transport. When will they ever fix this? 😤",
      "Watching the sunset from my balcony. Sometimes you just need to pause and appreciate the little things.",
      "Can't believe how amazing the concert was last night! @artist absolutely killed it! 🎵",
      "Stuck in traffic for 2 hours. This city's infrastructure is a complete joke.",
      "Finally finished my project! Months of hard work paid off. Feeling accomplished! 🎉",
      "The weather today is just... weather. Not good, not bad. Just existing.",
      "Shoutout to my amazing team! We just hit our quarterly targets! Couldn't have done it without you all! 💪",
      "Lost my wallet today. Universe really testing my patience this week.",
      "Just adopted a puppy! Meet Max, the newest member of our family! 🐕❤️",
    ],
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback',
    icon: MessageCircle,
    description: 'Support & feedback tickets',
    count: 10,
    texts: [
      "Your support team resolved my issue within minutes! Exceptional service. I'll definitely be a returning customer.",
      "I've been waiting 3 weeks for a response to my complaint. This is unacceptable customer service.",
      "The new feature works as described. No issues to report.",
      "Thank you for the quick refund process! It was hassle-free and I really appreciate the transparency.",
      "The app keeps crashing every time I try to checkout. Very frustrating and I've lost potential purchases.",
      "Love the recent UI update! Much cleaner and easier to navigate now.",
      "Order arrived but one item was missing. Need this resolved ASAP for an event this weekend.",
      "Your loyalty program is fantastic! The rewards actually feel worthwhile unlike other companies.",
      "Tried calling support 5 times today, always put on hold for 30+ minutes. Terrible experience.",
      "The product quality has been consistent over 2 years. Reliable and trustworthy brand.",
    ],
  },
  {
    id: 'movie-reviews',
    name: 'Movie Reviews',
    icon: Star,
    description: 'Film critiques & opinions',
    count: 10,
    texts: [
      "A masterpiece of cinema! The storytelling, acting, and visuals all come together perfectly. Must watch!",
      "Two hours of my life I'll never get back. The plot was predictable and the acting was wooden.",
      "It was entertaining enough for a Sunday afternoon. Nothing memorable but not terrible either.",
      "This film moved me to tears. Powerful performances and a story that stays with you long after.",
      "Complete disappointment. The trailer was better than the actual movie. False advertising at its finest.",
      "Solid sequel that respects the original while adding new elements. Fans will be pleased.",
      "Average at best. It had potential but failed to deliver on its promising premise.",
      "One of the best films of the decade! Every scene is crafted with such attention to detail.",
      "Boring, slow-paced, and way too long. Could have cut an hour and it would still drag.",
      "Fun popcorn movie! Don't expect deep themes but it delivers on action and entertainment.",
    ],
  },
  {
    id: 'workplace-feedback',
    name: 'Workplace Feedback',
    icon: Briefcase,
    description: 'Employee & workplace reviews',
    count: 10,
    texts: [
      "Great company culture! The management truly cares about work-life balance and employee wellbeing.",
      "Toxic work environment. Unrealistic expectations and no recognition for hard work.",
      "The job is fine. Standard corporate experience with typical pros and cons.",
      "Best workplace I've ever been at! Collaborative team, interesting projects, and excellent benefits.",
      "No growth opportunities here. Been in the same position for 3 years despite promises of promotion.",
      "Flexible working hours and supportive colleagues make coming to work enjoyable.",
      "The pay is decent but the workload is overwhelming. Constant burnout is the norm here.",
      "Amazing mentorship program! Senior staff genuinely invest time in helping juniors grow.",
      "Micromanagement at its worst. Every task requires approval from multiple levels.",
      "Fair compensation and the office location is convenient. Standard corporate job overall.",
    ],
  },
];

interface SampleDatasetsProps {
  onLoadDataset: (texts: string[]) => void;
  isDisabled?: boolean;
}

export const SampleDatasets: React.FC<SampleDatasetsProps> = ({
  onLoadDataset,
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDataset = (dataset: SampleDataset) => {
    onLoadDataset(dataset.texts);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          disabled={isDisabled}
        >
          <Sparkles className="w-4 h-4 text-primary" />
          Sample Data
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 bg-popover">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          Load Sample Dataset
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SAMPLE_DATASETS.map((dataset) => {
          const Icon = dataset.icon;
          return (
            <DropdownMenuItem
              key={dataset.id}
              onClick={() => handleSelectDataset(dataset)}
              className="flex items-start gap-3 p-3 cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{dataset.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {dataset.count}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {dataset.description}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
