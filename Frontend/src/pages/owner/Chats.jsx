import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import ChatBox from '../../components/ChatBox';

const Chats = () => {
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeConversation, setActiveConversation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }
            if (user?.role !== 'owner') {
                navigate('/');
                return;
            }
            fetchConversations();
        }
    }, [isAuthenticated, user, authLoading, navigate]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/messages/conversations');
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${conv.car_brand} ${conv.car_model}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else if (diffInHours < 168) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mb-4"></div>
                    <p className="text-gray-600">Loading conversations...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'owner') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    {/* Conversations List */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                        {/* Search */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                            </div>
                        </div>

                        {/* Conversations */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-center p-6">
                                    <div>
                                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <p className="text-gray-500 font-medium">No conversations yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Messages will appear here</p>
                                    </div>
                                </div>
                            ) : (
                                filteredConversations.map((conv) => (
                                    <motion.div
                                        key={`${conv.conversation_id}-${conv.other_user_id}`}
                                        whileHover={{ backgroundColor: '#f9fafb' }}
                                        onClick={() => setActiveConversation(conv)}
                                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${activeConversation?.conversation_id === conv.conversation_id &&
                                                activeConversation?.other_user_id === conv.other_user_id
                                                ? 'bg-red-50 border-l-4 border-l-red-600'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {conv.other_user_name.charAt(0).toUpperCase()}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {conv.other_user_name}
                                                    </h3>
                                                    {conv.last_message_time && (
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            {formatTime(conv.last_message_time)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">
                                                    {conv.car_brand} {conv.car_model}
                                                </p>
                                                {conv.last_message && (
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {conv.last_message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Unread Badge */}
                                            {conv.unread_count > 0 && (
                                                <div className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                                                    {conv.unread_count}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                        {activeConversation ? (
                            <div className="h-full relative">
                                {/* Close button for mobile */}
                                <button
                                    onClick={() => setActiveConversation(null)}
                                    className="lg:hidden absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Render ChatBox inline */}
                                <div className="h-full">
                                    <AnimatePresence>
                                        <ChatBox
                                            booking={activeConversation.conversation_type === 'booking' ? {
                                                id: activeConversation.conversation_id,
                                                car_brand: activeConversation.car_brand,
                                                car_model: activeConversation.car_model
                                            } : null}
                                            car={activeConversation.conversation_type === 'car' ? {
                                                id: activeConversation.conversation_id,
                                                brand: activeConversation.car_brand,
                                                model: activeConversation.car_model
                                            } : null}
                                            otherUser={{
                                                id: activeConversation.other_user_id,
                                                full_name: activeConversation.other_user_name
                                            }}
                                            onClose={() => setActiveConversation(null)}
                                        />
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-center p-6">
                                <div>
                                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Select a conversation
                                    </h3>
                                    <p className="text-gray-500">
                                        Choose a conversation from the list to start chatting
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chats;
