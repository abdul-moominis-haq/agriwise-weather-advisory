
import { useState } from 'react';
import { Users, MessageSquare, Plus, Search } from 'lucide-react';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  replies: number;
  category: string;
  likes: number;
}

const Community = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const forumPosts: ForumPost[] = [
    {
      id: 1,
      title: 'Best practices for tomato pest control in rainy season',
      content: 'I\'ve been struggling with pest issues in my tomato farm during the current rainy season. What organic methods have worked best for you?',
      author: 'Kwaku Farmer',
      timestamp: '2 hours ago',
      replies: 12,
      category: 'Pest Control',
      likes: 18
    },
    {
      id: 2,
      title: 'Successful maize varieties for Northern Ghana',
      content: 'Looking for recommendations on drought-resistant maize varieties that perform well in Northern Ghana climate conditions.',
      author: 'Akosua Agric',
      timestamp: '5 hours ago',
      replies: 8,
      category: 'Crop Selection',
      likes: 14
    },
    {
      id: 3,
      title: 'Soil preparation techniques for the dry season',
      content: 'With the dry season approaching, what are the best soil preparation methods to retain moisture and improve crop yield?',
      author: 'Kofi Mensah',
      timestamp: '1 day ago',
      replies: 15,
      category: 'Soil Management',
      likes: 22
    },
    {
      id: 4,
      title: 'Irrigation system setup for small-scale farming',
      content: 'I want to set up a simple but effective irrigation system for my 2-acre farm. Any cost-effective solutions?',
      author: 'Ama Osei',
      timestamp: '2 days ago',
      replies: 6,
      category: 'Irrigation',
      likes: 11
    }
  ];

  const categories = ['all', 'Pest Control', 'Crop Selection', 'Soil Management', 'Irrigation', 'Weather', 'Harvesting'];

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            Farmer Community
          </h1>
          <p className="text-gray-600">Connect, share knowledge, and learn from fellow farmers</p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">1,247</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">342</div>
            <div className="text-sm text-gray-600">Discussions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">89</div>
            <div className="text-sm text-gray-600">Experts</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Discussion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Forum Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-4">
                  {post.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">{post.author}</span>
                  <span>{post.timestamp}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.replies} replies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
            <p className="text-gray-500">Try adjusting your search or create a new discussion</p>
          </div>
        )}

        {/* Featured Topics */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Seasonal Tips</h3>
              <p className="text-sm text-green-600">Get expert advice for current season farming practices</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Weather Updates</h3>
              <p className="text-sm text-blue-600">Stay informed about weather patterns and forecasts</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Market Prices</h3>
              <p className="text-sm text-yellow-600">Discuss current market trends and pricing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
