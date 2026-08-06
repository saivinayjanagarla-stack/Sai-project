import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Plus, 
  Sparkles, 
  User, 
  Calendar, 
  CheckCircle2, 
  Trees, 
  Zap, 
  Car, 
  X, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Send,
  MoreHorizontal,
  Bookmark,
  Check
} from 'lucide-react';
import api from '../services/api';

const DEFAULT_POSTS = [
  {
    id: 'p1',
    author: 'Marcus Vance',
    role: 'Chief Energy Auditor • GreenCorp HQ',
    avatarBg: 'bg-emerald-500 text-white',
    time: '2 hours ago',
    content: 'Excited to report that our Phase 1 Rooftop Solar Array just crossed 100,000 kWh of clean energy generation! This official milestone offsets approximately 38.5 metric tonnes of Scope 2 location-based grid emissions.',
    co2Saved: '180 kg CO2 saved',
    badge: '🥇 Net-Zero Pioneer',
    likes: 24,
    hasLiked: false,
    comments: [
      { id: 'c1', author: 'Elena Rostova', text: 'Huge congratulations Marcus! Are you pairing this with battery storage next quarter?' },
      { id: 'c2', author: 'David Chen', text: 'Inspiring work! Saving this for our facility benchmark review.' }
    ],
    showComments: false
  },
  {
    id: 'p2',
    author: 'Priya Sharma',
    role: 'Sustainability Lead • Campus East',
    avatarBg: 'bg-blue-500 text-white',
    time: '5 hours ago',
    content: 'We hosted our Q2 Zero Waste Campus Event today! With over 250 employees participating, we diverted 100% of event waste from landfills using compostable packaging and smart sorting bins.',
    co2Saved: '65 kg CO2 saved',
    badge: '♻️ Zero Waste Champion',
    likes: 18,
    hasLiked: false,
    comments: [
      { id: 'c3', author: 'Marcus Vance', text: 'Great template for our EMEA office rollout!' }
    ],
    showComments: false
  },
  {
    id: 'p3',
    author: 'Elena Rostova',
    role: 'Logistics Operations Director',
    avatarBg: 'bg-purple-500 text-white',
    time: '1 day ago',
    content: 'Transitioned 40% of our corporate shuttle fleet to 100% Electric Vehicles. Initial telemetry shows a 42.5 kg daily reduction in diesel tailpipe emissions!',
    co2Saved: '42.5 kg CO2 saved',
    badge: '🚗 EV Fleet Trailblazer',
    likes: 31,
    hasLiked: false,
    comments: [],
    showComments: false
  }
];

const DEFAULT_LEADERBOARD = [
  { rank: 1, user_name: 'Marcus Vance', total_points: 1450, total_co2_saved: 420.0, badge: '🥇 Net-Zero Pioneer' },
  { rank: 2, user_name: 'Priya Sharma', total_points: 1120, total_co2_saved: 310.0, badge: '🥈 Eco Master' },
  { rank: 3, user_name: 'Elena Rostova', total_points: 980, total_co2_saved: 245.0, badge: '🥉 Solar Champion' },
  { rank: 4, user_name: 'David Chen', total_points: 750, total_co2_saved: 180.0, badge: '⚡ Energy Saver' }
];

const ECO_CHALLENGES = [
  { id: 'ch1', title: '🚶 Zero-Emissions Commute Week', participants: 142, daysLeft: 5, reward: '+250 pts', icon: Car, bg: 'bg-emerald-50 text-emerald-700' },
  { id: 'ch2', title: '🔌 Unplugged Peak Demand Shaving', participants: 89, daysLeft: 3, reward: '+180 pts', icon: Zap, bg: 'bg-amber-50 text-amber-700' },
  { id: 'ch3', title: '🌲 Campus Micro-Forest Planting', participants: 210, daysLeft: 12, reward: '+350 pts', icon: Trees, bg: 'bg-teal-50 text-teal-700' }
];

export default function CommunityLeaderboard() {
  const [posts, setPosts] = useState(DEFAULT_POSTS);
  const [leaderboard, setLeaderboard] = useState(DEFAULT_LEADERBOARD);
  const [challenges, setChallenges] = useState(ECO_CHALLENGES);
  const [joinedChallenges, setJoinedChallenges] = useState({});
  const [copiedPostId, setCopiedPostId] = useState(null);

  // Post Creator State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Plant Trees');
  const [newPostCo2, setNewPostCo2] = useState('25');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Comment Input State
  const [commentInputs, setCommentInputs] = useState({});

  // Toggle Like Action
  const handleLike = (id) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    }));
  };

  // Toggle Show Comments
  const toggleComments = (id) => {
    setPosts(prev => prev.map(post => post.id === id ? { ...post, showComments: !post.showComments } : post));
  };

  // Add Comment Action
  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      author: 'Sarah Jenkins',
      text: text.trim()
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Share Post Action
  const handleSharePost = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/community#${id}`);
    setCopiedPostId(id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  // Join Eco Challenge Action
  const handleJoinChallenge = (chId) => {
    setJoinedChallenges(prev => ({ ...prev, [chId]: true }));
  };

  // Handle New Post Submission
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now().toString(),
      author: 'Sarah Jenkins',
      role: 'Sustainability Lead • Enterprise Admin',
      avatarBg: 'bg-emerald-600 text-white',
      time: 'Just now',
      content: newPostContent,
      co2Saved: `🌱 ${newPostCo2} kg CO2 saved`,
      badge: '✨ Eco Innovator',
      likes: 1,
      hasLiked: true,
      comments: [],
      showComments: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🚀 Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-glass">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Enterprise Sustainability Social Network</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">🌱 Eco Community & Feed</h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect with facility managers, share decarbonization milestones, complete eco challenges, and earn carbon credits.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post Eco Update</span>
        </button>
      </div>

      {/* 3-Column LinkedIn Style Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: User Profile & Achievements Badge Card (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Profile Card */}
          <div className="glass-card-light p-5 rounded-3xl border border-slate-200/80 text-center space-y-3 shadow-glass">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              S
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Sarah Jenkins</h3>
              <p className="text-xs text-slate-500 font-medium">Chief Sustainability Officer</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                Level 4 • Net Zero Hero
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-2xl bg-slate-50">
                <span className="block text-[9px] font-extrabold text-slate-400 uppercase">Carbon Credits</span>
                <span className="text-sm font-black text-amber-600">1,450 pts</span>
              </div>
              <div className="p-2 rounded-2xl bg-slate-50">
                <span className="block text-[9px] font-extrabold text-slate-400 uppercase">CO2 Offset</span>
                <span className="text-sm font-black text-emerald-600">420 kg</span>
              </div>
            </div>
          </div>

          {/* Achievements & Badges List */}
          <div className="glass-card-light p-5 rounded-3xl border border-slate-200/80 space-y-3 shadow-glass">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Earned Badges
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-50 flex items-center space-x-2.5">
                <span className="text-lg">🥇</span>
                <div>
                  <div className="font-bold text-slate-900">Net-Zero Pioneer</div>
                  <div className="text-[10px] text-slate-400">Scope 1 reduction verified</div>
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 flex items-center space-x-2.5">
                <span className="text-lg">⚡</span>
                <div>
                  <div className="font-bold text-slate-900">Solar Ambassador</div>
                  <div className="text-[10px] text-slate-400">100+ kW solar installation</div>
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-50 flex items-center space-x-2.5">
                <span className="text-lg">🌿</span>
                <div>
                  <div className="font-bold text-slate-900">Tree Guardian</div>
                  <div className="text-[10px] text-slate-400">50+ micro-forest trees planted</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Hashtags */}
          <div className="glass-card-light p-5 rounded-3xl border border-slate-200/80 space-y-2.5 shadow-glass">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Trending Topics
            </h4>
            <div className="space-y-1.5 text-xs font-bold text-slate-700">
              <div className="hover:text-emerald-600 cursor-pointer transition-colors flex justify-between">
                <span>#SolarMicrogrids</span>
                <span className="text-slate-400 font-normal">42 posts</span>
              </div>
              <div className="hover:text-emerald-600 cursor-pointer transition-colors flex justify-between">
                <span>#Scope3Decarbonization</span>
                <span className="text-slate-400 font-normal">28 posts</span>
              </div>
              <div className="hover:text-emerald-600 cursor-pointer transition-colors flex justify-between">
                <span>#HeatPumpRetrofits</span>
                <span className="text-slate-400 font-normal">35 posts</span>
              </div>
              <div className="hover:text-emerald-600 cursor-pointer transition-colors flex justify-between">
                <span>#ZeroWasteCampus</span>
                <span className="text-slate-400 font-normal">19 posts</span>
              </div>
            </div>
          </div>

        </div>

        {/* Center Column: LinkedIn-Style Feed Stream (6 columns) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Post Input Prompt Card */}
          <div 
            onClick={() => setShowCreateModal(true)}
            className="glass-card-light p-4 rounded-3xl border border-slate-200/80 shadow-glass flex items-center space-x-3 cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
              S
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-400 font-medium">
              Share an eco accomplishment, energy milestone, or zero-waste update...
            </div>
          </div>

          {/* Feed Posts */}
          {posts.map((post) => (
            <div key={post.id} className="glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-glass">
              
              {/* Post Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${post.avatarBg} font-extrabold flex items-center justify-center text-sm`}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{post.author}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{post.role}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{post.time} • 🌐 Public</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                  {post.badge}
                </span>
              </div>

              {/* Post Body */}
              <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                {post.content}
              </p>

              {/* CO2 Savings Highlight Badge */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span>{post.co2Saved}</span>
              </div>

              {/* Interaction Bar (Like, Comment, Share) */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                    post.hasLiked
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                  <span>Like ({post.likes})</span>
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold hover:bg-slate-100 text-slate-600 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Comment ({post.comments.length})</span>
                </button>

                <button
                  onClick={() => handleSharePost(post.id)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold hover:bg-slate-100 text-slate-600 transition-all"
                >
                  {copiedPostId === post.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedPostId === post.id ? 'Copied' : 'Share'}</span>
                </button>
              </div>

              {/* Inline Comments Section */}
              {post.showComments && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="space-y-2">
                    {post.comments.map(comm => (
                      <div key={comm.id} className="p-3 rounded-2xl bg-slate-50 text-xs space-y-0.5">
                        <span className="font-extrabold text-slate-900 block">{comm.author}</span>
                        <p className="text-slate-600 font-medium">{comm.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          ))}

        </div>

        {/* Right Column: Eco Challenges & Leaderboard (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Active Eco Challenges */}
          <div className="glass-card-light p-5 rounded-3xl border border-slate-200/80 space-y-3 shadow-glass">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600" /> Active Eco Challenges
            </h4>

            <div className="space-y-2.5">
              {challenges.map(ch => {
                const Icon = ch.icon;
                const isJoined = joinedChallenges[ch.id];
                return (
                  <div key={ch.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="flex items-start space-x-2.5">
                      <div className={`w-8 h-8 rounded-xl ${ch.bg} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-900">{ch.title}</h5>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {ch.participants} joined • {ch.daysLeft} days left
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-black text-amber-600">{ch.reward}</span>
                      <button
                        onClick={() => handleJoinChallenge(ch.id)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-extrabold transition-all ${
                          isJoined
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {isJoined ? '✓ Joined' : 'Join Challenge'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Leaderboard Champions Widget */}
          <div className="glass-card-light p-5 rounded-3xl border border-slate-200/80 space-y-3 shadow-glass">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" /> Leaderboard
              </h4>
              <span className="text-[10px] text-slate-400 font-bold">Top 4</span>
            </div>

            <div className="space-y-2">
              {leaderboard.map((item) => (
                <div key={item.rank} className="p-2.5 rounded-2xl bg-white border border-slate-200/70 shadow-2xs flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-sm">
                      {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{item.user_name}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{item.total_co2_saved} kg CO2 saved</span>
                    </div>
                  </div>
                  <span className="font-black text-amber-600 text-xs">{item.total_points} pts</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Post Creator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Post Eco Update</h3>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Share Your Accomplishment</label>
                <textarea
                  placeholder="What decarbonization or sustainability milestone did you achieve today?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Estimated CO2 Saved (kg)</label>
                <input
                  type="number"
                  value={newPostCo2}
                  onChange={(e) => setNewPostCo2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-2xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-500/20"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
