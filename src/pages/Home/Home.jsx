import { useState, useContext } from 'react'
import { Typography } from '@components/common/Typography'
import { Card } from '@components/common/Card'
import { Flex } from '@components/common/Layout'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { ThemeContext } from '@/store/context/ThemeContext'
import * as S from './Home.styles'

const Home = () => {
  const [activeFilter, setActiveFilter] = useState('Tudo')
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)

  const sidebarItems = [
    { label: 'Feed', active: true },
    { label: 'Em Alta', active: false },
    { label: 'Instagram', active: false },
    { label: 'Twitter/X', active: false },
    { label: 'Youtube', active: false },
    { label: 'Salvos', active: false },
    { label: 'Notificações', active: false },
  ]

  const feedItems = [
    { 
      id: 1, 
      user: 'John Doe', 
      handle: '@johndoe', 
      content: 'Building a new React application with a Twitter-like layout! #webdev #reactjs',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
      stats: { replies: 12, retweets: 5, likes: 48, views: '1.2k' }
    },
    { 
      id: 2, 
      user: 'Jane Smith', 
      handle: '@janesmith', 
      content: 'Just discovered styled-components. It is amazing how clean the code becomes.',
      stats: { replies: 4, retweets: 2, likes: 25, views: '800' }
    },
    { 
      id: 3, 
      user: 'Tech News', 
      handle: '@technews', 
      content: 'The future of web development is looking bright with AI-assisted coding tools.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
      stats: { replies: 45, retweets: 89, likes: 320, views: '15k' }
    },
    { 
      id: 4, 
      user: 'Dev Guru', 
      handle: '@devguru', 
      content: 'Check out this new CSS Grid tutorial. It makes layouts so much easier!',
      stats: { replies: 8, retweets: 12, likes: 67, views: '2.4k' }
    },
    { 
      id: 5, 
      user: 'Design Weekly', 
      handle: '@designweekly', 
      content: 'Top 10 UI trends to watch in 2026. Minimalist designs are still leading.',
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800&auto=format&fit=crop&q=60',
      stats: { replies: 22, retweets: 15, likes: 110, views: '5.6k' }
    },
    { 
      id: 6, 
      user: 'React Insider', 
      handle: '@reactinsider', 
      content: 'React 19 features you should start using today for better performance.',
      stats: { replies: 15, retweets: 30, likes: 145, views: '10k' }
    },
    { 
      id: 7, 
      user: 'Traveler', 
      handle: '@worldtraveler', 
      content: 'Just arrived in Kyoto. The temples are absolutely breathtaking! The mixture of tradition and modernity here is something you have to experience at least once in your life.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=60',
      stats: { replies: 5, retweets: 8, likes: 92, views: '3.1k' }
    },
    { 
      id: 8, 
      user: 'Quick Tips', 
      handle: '@quicktips', 
      content: 'Pro tip: Use `Ctrl + D` to select the next occurrence of a word in VS Code.',
      stats: { replies: 2, retweets: 15, likes: 55, views: '1.2k' }
    },
    { 
      id: 9, 
      user: 'Foodie', 
      handle: '@foodie', 
      content: 'Homemade sourdough bread! It took 3 days but it was worth it. Look at that crust!',
      image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800&auto=format&fit=crop&q=60',
      stats: { replies: 18, retweets: 4, likes: 156, views: '4.8k' }
    },
  ]

  const trends = [
    { category: 'Technology · Trending', title: '#ReactJS', posts: '125K posts' },
    { category: 'Business · Trending', title: 'Silicon Valley', posts: '45.2K posts' },
    { category: 'Entertainment · Trending', title: 'New Movie Trailer', posts: '89K posts' },
    { category: 'Sports · Trending', title: 'World Cup 2026', posts: '1.2M posts' },
  ]

  const connectedSources = [
    { id: 1, name: 'Google Search', handle: 'google.com', avatar: 'GS' },
    { id: 2, name: 'Reddit API', handle: 'reddit.com', avatar: 'RD' },
    { id: 3, name: 'X/Twitter', handle: 'twitter.com', avatar: 'XT' },
  ]

    const filters = ['Tudo', 'Instagram', 'X', 'Reddit', 'OnlyFans']

  return (
    <S.MainLayout>
      <S.Sidebar className="main-sidebar">
        <Typography variant="h2" style={{ padding: '0 16px', marginBottom: '16px' }}>
          Painel+
        </Typography>
        {sidebarItems.map((item) => (
          <S.SidebarItem key={item.label} active={item.active}>
            <Typography variant="body" style={{ fontWeight: item.active ? 700 : 400 }}>
              {item.label}
            </Typography>
          </S.SidebarItem>
        ))}
        
        <S.ThemeToggle onClick={toggleTheme}>
          <Typography variant="body">
            {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </Typography>
        </S.ThemeToggle>
      </S.Sidebar>

      <S.Feed>
        <S.FeedHeader>
          <Card padding="16px">
            <Typography variant="h3" style={{ marginBottom: '16px' }}>Home</Typography>
            <Flex direction="column" gap="12px">
              <Input placeholder="Buscar no Painel+" style={{ marginBottom: 0 }} />
              <S.FilterContainer>
                {filters.map((filter) => (
                  <S.FilterPill
                    key={filter}
                    active={activeFilter === filter}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </S.FilterPill>
                ))}
              </S.FilterContainer>
            </Flex>
          </Card>
        </S.FeedHeader>

        {feedItems.map((post) => (
          <Card key={post.id} padding="20px">
            <Flex direction="column" gap="8px">
              <Flex gap="8px" align="center">
                <Typography variant="body" style={{ fontWeight: 700 }}>
                  {post.user}
                </Typography>
                <Typography variant="small" color="#666">
                  {post.handle}
                </Typography>
              </Flex>
              <Typography variant="body">
                {post.content}
              </Typography>
              
              {post.image && <S.PostImage src={post.image} alt="Post content" />}

              <S.ActionGroup>
                <S.ActionItem hoverColor="#1d9bf0">
                  <span>💬</span> {post.stats.replies}
                </S.ActionItem>
                <S.ActionItem hoverColor="#00ba7c">
                  <span>🔁</span> {post.stats.retweets}
                </S.ActionItem>
                <S.ActionItem hoverColor="#f91880">
                  <span>❤️</span> {post.stats.likes}
                </S.ActionItem>
                <S.ActionItem hoverColor="#1d9bf0">
                  <span>📊</span> {post.stats.views}
                </S.ActionItem>
                <S.ActionItem hoverColor="#1d9bf0">
                  <span>🔖</span>
                </S.ActionItem>
              </S.ActionGroup>
            </Flex>
          </Card>
        ))}
      </S.Feed>

      <S.TrendsSidebar className="trends-sidebar">
        <Card padding="0">
          <div style={{ padding: '16px' }}>
            <Typography variant="h3">Em alta</Typography>
          </div>
          {trends.map((trend) => (
            <S.TrendItem key={trend.title}>
              <Typography variant="small" color="#666">
                {trend.category}
              </Typography>
              <Typography variant="body" style={{ fontWeight: 700, display: 'block', margin: '4px 0' }}>
                {trend.title}
              </Typography>
              <Typography variant="small" color="#666">
                {trend.posts}
              </Typography>
            </S.TrendItem>
          ))}
          <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Typography variant="body" color="#1d9bf0" style={{ cursor: 'pointer' }}>
              Show more
            </Typography>
          </div>
        </Card>

        <Card padding="0">
          <div style={{ padding: '16px' }}>
            <Typography variant="h3">Fontes Conectadas</Typography>
          </div>
          {connectedSources.map((source) => (
            <S.SourceItem key={source.id}>
              <S.SourceInfo>
                <S.Avatar>{source.avatar}</S.Avatar>
                <div>
                  <Typography variant="body" style={{ fontWeight: 700, display: 'block' }}>
                    {source.name}
                  </Typography>
                  <Typography variant="small" color="#666">
                    {source.handle}
                  </Typography>
                </div>
              </S.SourceInfo>
              <Button variant="secondary" onClick={() => {}}>
                Conectar
              </Button>
            </S.SourceItem>
          ))}
          <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Typography variant="body" color="#1d9bf0" style={{ cursor: 'pointer' }}>
              Show more
            </Typography>
          </div>
        </Card>
      </S.TrendsSidebar>
    </S.MainLayout>
  )
}

export default Home
