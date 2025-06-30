
import { Bell, CheckCircle, X, Clock } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  ai_confidence?: number;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  expires_at?: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const RecommendationCard = ({ recommendation, onMarkRead, onDismiss }: RecommendationCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const isExpired = recommendation.expires_at && new Date(recommendation.expires_at) < new Date();

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      recommendation.is_read ? 'opacity-75' : ''
    } ${isExpired ? 'opacity-60' : ''} ${
      recommendation.is_dismissed ? 'hidden' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Bell className={`h-4 w-4 ${
            recommendation.priority === 'high' ? 'text-red-500' : 
            recommendation.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
          }`} />
          <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(recommendation.priority)}`}>
            {recommendation.priority}
          </span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {recommendation.category}
          </span>
          {isExpired && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Expired
            </div>
          )}
        </div>
        
        <div className="flex space-x-1">
          {!recommendation.is_read && (
            <button
              onClick={() => onMarkRead(recommendation.id)}
              className="text-green-600 hover:text-green-800 p-1"
              title="Mark as read"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDismiss(recommendation.id)}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h3 className="font-medium text-gray-900 mb-2">{recommendation.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{recommendation.message}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatTimestamp(recommendation.created_at)}</span>
        {recommendation.ai_confidence && (
          <span>AI Confidence: {Math.round(recommendation.ai_confidence * 100)}%</span>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
