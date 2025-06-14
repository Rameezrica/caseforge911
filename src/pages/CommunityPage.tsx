import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, TrendingUp, Clock, Award, Filter, Search, Plus,
  ChevronRight, ChevronLeft, ThumbsUp, Share, Bookmark, Users,
  ArrowUp, ArrowDown
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const CommunityPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top' | 'rising'>('hot');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const mockPosts = [
    {
      id: '1',
      title: 'Tips for solving market sizing cases?',
      content: 'I have an upcoming consulting interview and would love some advice on approaching market sizing questions effectively...',
      author: 'username',
      postedAt: '12 hours ago',
      votes: 42,
      commentCount: 24,
      tags: ['Interview Prep', 'Market Sizing', 'Consulting']
    },
    {
      id: '2',
      title: 'How to structure M&A valuation cases?',
      content: 'Looking for advice on best practices for approaching M&A valuation cases. What frameworks do you recommend?',
      author: 'finance_pro',
      postedAt: '2 days ago',
      votes: 38,
      commentCount: 16,
      tags: ['Finance', 'M&A', 'Valuation']
    },
    {
      id: '3',
      title: 'Success Story: From Zero to MBB!',
      content: "After 6 months of dedicated practice on CaseForge, I'm excited to share that I've received offers from multiple top consulting firms...",
      author: 'success_story',
      postedAt: '1 week ago',
      votes: 156,
      commentCount: 45,
      tags: ['Success Story', 'Consulting', 'Interview']
    },
    {
      id: '4',
      title: 'Supply Chain Case Study Discussion',
      content: "Just completed the Nike Supply Chain case. Here's my approach and key learnings. Would love feedback from the community...",
      author: 'operations_guru',
      postedAt: '3 days ago',
      votes: 72,
      commentCount: 31,
      tags: ['Operations', 'Supply Chain', 'Case Study']
    },
    {
      id: '5',
      title: 'Private Equity Case Framework',
      content: "I've developed a comprehensive framework for PE cases based on my experience. Here's a detailed breakdown...",
      author: 'pe_expert',
      postedAt: '5 days ago',
      votes: 94,
      commentCount: 37,
      tags: ['Private Equity', 'Framework', 'Finance']
    }
  ];

  return (
    <div className="container py-8">
      <div className="flex gap-6">
        <div className="flex-1">
          {/* Create Post */}
          <Card className="p-4 mb-6">
            <Link 
              to="/community/create-post"
              className="flex items-center space-x-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div className="flex-1 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                Create Post
              </div>
            </Link>
          </Card>

          {/* Sort Controls */}
          <Card className="p-4 mb-6">
            <div className="flex space-x-2">
              <Button 
                variant={sortBy === 'hot' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('hot')}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Hot
              </Button>
              <Button 
                variant={sortBy === 'new' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('new')}
                className="gap-2"
              >
                <Clock className="h-4 w-4" />
                New
              </Button>
              <Button 
                variant={sortBy === 'top' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('top')}
                className="gap-2"
              >
                <Award className="h-4 w-4" />
                Top
              </Button>
            </div>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {mockPosts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Voting */}
                  <div className="flex flex-col items-center space-y-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="text-foreground font-medium text-sm">{post.votes}</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                      <span>Posted by</span>
                      <a href="#" className="hover:text-primary transition-colors">{post.author}</a>
                      <span>{post.postedAt}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {post.content}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <Button variant="ghost" size="sm" className="gap-2 h-auto p-0">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.commentCount} Comments</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 h-auto p-0">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 h-auto p-0">
                        <Bookmark className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-12'}`}>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute -left-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-card border shadow-sm"
            >
              {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            
            <div className={`space-y-6 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              {/* About Community */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">About Community</h2>
                <p className="text-muted-foreground mb-6">
                  A place to discuss business cases, share insights, and help each other prepare for case interviews.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Members</span>
                    <span className="text-foreground font-medium">12.5k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Online</span>
                    <span className="text-foreground font-medium">234</span>
                  </div>
                </div>
              </Card>

              {/* Community Rules */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Community Rules</h2>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-foreground font-medium mr-2">1.</span>
                    <span className="text-muted-foreground">Be respectful and helpful</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-foreground font-medium mr-2">2.</span>
                    <span className="text-muted-foreground">No spam or self-promotion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-foreground font-medium mr-2">3.</span>
                    <span className="text-muted-foreground">Use appropriate post flairs</span>
                  </li>
                </ol>
              </Card>

              {/* Moderators */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Moderators</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <span className="ml-2 text-foreground">moderator1</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <span className="ml-2 text-foreground">moderator2</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;