import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, TrendingUp, Clock, Award, Filter, Search, Plus,
  ChevronRight, ChevronLeft, ThumbsUp, Share, Bookmark, Users
} from 'lucide-react';

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
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Create Post Button */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-4 mb-6">
            <Link 
              to="/community/create-post"
              className="flex items-center space-x-4 text-dark-400"
            >
              <div className="h-10 w-10 rounded-full bg-dark-700 flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div className="flex-1 px-4 py-2 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors duration-200">
                Create Post
              </div>
            </Link>
          </div>

          {/* Sort Options */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-4 mb-6">
            <div className="flex space-x-4">
              <button 
                onClick={() => setSortBy('hot')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'hot' ? 'bg-dark-700 text-emerald-500' : 'text-dark-400 hover:bg-dark-700'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Hot
              </button>
              <button 
                onClick={() => setSortBy('new')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'new' ? 'bg-dark-700 text-emerald-500' : 'text-dark-400 hover:bg-dark-700'
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                New
              </button>
              <button 
                onClick={() => setSortBy('top')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'top' ? 'bg-dark-700 text-emerald-500' : 'text-dark-400 hover:bg-dark-700'
                }`}
              >
                <Award className="h-4 w-4 mr-2" />
                Top
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {mockPosts.map((post) => (
              <div key={post.id} className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <button className="text-dark-400 hover:text-emerald-500 transition-colors duration-200">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <span className="text-dark-200 font-medium">{post.votes}</span>
                    <button className="text-dark-400 hover:text-red-500 transition-colors duration-200">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-sm text-dark-400 mb-2">
                      <span>Posted by</span>
                      <a href="#" className="hover:text-emerald-500 transition-colors duration-200">{post.author}</a>
                      <span>{post.postedAt}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-dark-50 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-dark-300 mb-4">
                      {post.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-dark-700 text-dark-200 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4 text-dark-400">
                      <button className="flex items-center space-x-2 hover:text-dark-200 transition-colors duration-200">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.commentCount} Comments</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-dark-200 transition-colors duration-200">
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-dark-200 transition-colors duration-200">
                        <Bookmark className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-12'}`}>
          <div className="relative">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-dark-700 rounded-full p-1 text-dark-400 hover:text-dark-200 transition-colors duration-200"
            >
              {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            
            <div className={`space-y-6 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <h2 className="text-lg font-semibold text-dark-50 mb-4">About Community</h2>
                <p className="text-dark-300 mb-6">
                  A place to discuss business cases, share insights, and help each other prepare for case interviews.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-dark-400">Members</span>
                    <span className="text-dark-200 font-medium">12.5k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Online</span>
                    <span className="text-dark-200 font-medium">234</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <h2 className="text-lg font-semibold text-dark-50 mb-4">Community Rules</h2>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-dark-200 font-medium mr-2">1.</span>
                    <span className="text-dark-300">Be respectful and helpful</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-dark-200 font-medium mr-2">2.</span>
                    <span className="text-dark-300">No spam or self-promotion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-dark-200 font-medium mr-2">3.</span>
                    <span className="text-dark-300">Use appropriate post flairs</span>
                  </li>
                </ol>
              </div>

              <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
                <h2 className="text-lg font-semibold text-dark-50 mb-4">Moderators</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-dark-700"></div>
                    <span className="ml-2 text-dark-200">moderator1</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-dark-700"></div>
                    <span className="ml-2 text-dark-200">moderator2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;