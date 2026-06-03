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
    { label: 'Feed', active: true, icon: 'fa-house' },
    { label: 'Em Alta', active: false, icon: 'fa-fire' },
    { label: 'Instagram', active: false, icon: 'fa-brands fa-instagram' },
    { label: 'Twitter / X', active: false, icon: 'fa-brands fa-twitter' },
    { label: 'YouTube', active: false, icon: 'fa-brands fa-youtube' },
    { label: 'Salvos', active: false, icon: 'fa-bookmark' },
    { label: 'Notificações', active: false, icon: 'fa-bell' },
  ]

  const feedItems = [
    { 
      id: 1, 
      platform: 'Instagram',
      platformIcon: 'fa-brands fa-instagram',
      platformColor: '#E1306C',
      user: 'National Geographic', 
      handle: '@natgeo', 
      content: 'The Amazon rainforest is home to some of the most dramatic landscapes on Earth. From sweeping mountain vistas to deep jungle canyons, its scale is truly breathtaking.',
      image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=800&auto=format&fit=crop&q=60',
      stats: { replies: 124, retweets: 450, likes: '12k', views: '200k' }
    },
    { 
      id: 2, 
      platform: 'Twitter / X',
      platformIcon: 'fa-brands fa-twitter',
      platformColor: '#000000',
      user: 'Elon Musk', 
      handle: '@elonmusk', 
      content: 'Engineering is the closest thing to magic that exists in the real world. Applied science solving complex problems for humanity.',
      stats: { replies: '25k', retweets: '45k', likes: '320k', views: '15M' }
    },
    { 
      id: 3, 
      platform: 'YouTube',
      platformIcon: 'fa-brands fa-youtube',
      platformColor: '#FF0000',
      user: 'Tech Reviewer', 
      handle: '@techrev', 
      content: 'Building the ultimate workstation for 2026. This setup is absolute overkill but so satisfying.',
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=60',
      stats: { replies: 890, retweets: 120, likes: '15k', views: '1.2M' }
    },
    { 
      id: 4, 
      platform: 'Instagram',
      platformIcon: 'fa-brands fa-instagram',
      platformColor: '#E1306C',
      user: 'Traveler', 
      handle: '@worldtraveler', 
      content: 'Kyoto mornings. The silence of the temples is something everyone should experience.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=60',
      stats: { replies: 45, retweets: 12, likes: 850, views: '12k' }
    },
  ]

  const trends = [
    { category: 'Trending', title: '#InteligenciaArtificial', posts: '1.2M posts' },
    { category: 'Trending', title: '#Webb', posts: '45.2K posts' },
    { category: 'Trending', title: '#ReactJS', posts: '89K posts' },
    { category: 'Trending', title: '#Tecnologia', posts: '250K posts' },
    { category: 'Trending', title: '#NASA', posts: '120K posts' },
    { category: 'Trending', title: '#OpenAI', posts: '310K posts' },
  ]

  const connectedSources = [
    { id: 1, name: 'Instagram', icon: 'fa-brands fa-instagram', color: '#E1306C', status: '4 posts carregados' },
    { id: 2, name: 'Twitter / X', icon: 'fa-brands fa-twitter', color: '#000000', status: '4 posts carregados' },
    { id: 3, name: 'YouTube', icon: 'fa-brands fa-youtube', color: '#FF0000', status: '4 posts carregados' },
  ]

  const filters = [
    { label: 'Tudo', icon: 'fa-border-all' },
    { label: 'Instagram', icon: 'fa-brands fa-instagram' },
    { label: 'X', icon: 'fa-brands fa-twitter' },
    { label: 'Youtube', icon: 'fa-brands fa-youtube' },
    { label: 'OnlyFans', icon: 'fa-brands fa-linkedin' }
    
  ]

  return (
    <S.MainLayout>
      <S.Sidebar className="main-sidebar">
        <Typography variant="h2" style={{ padding: '0 16px', marginBottom: '16px' }}>
          Painel+
        </Typography>
        {sidebarItems.map((item) => (
          <S.SidebarItem key={item.label} active={item.active}>
            <S.PlatformIcon className={`fa-solid ${item.icon}`} />
            <Typography variant="body" style={{ fontWeight: item.active ? 700 : 400 }}>
              {item.label}
            </Typography>
          </S.SidebarItem>
        ))}
        
        <S.ProfileSection>
          <S.Avatar>VC</S.Avatar>
          <div>
            <Typography variant="body" style={{ fontWeight: 700 }}>Você</Typography>
            <Typography variant="small" color="#666">@minha_conta</Typography>
          </div>
        </S.ProfileSection>
      </S.Sidebar>

      <S.Feed>
        <S.FeedHeader>
          <Card padding="16px">
       
            <Flex direction="column" gap="12px">
              <Input placeholder="Buscar posts, pessoas, hashtags..." style={{ marginBottom: 0 }} />
              <S.FilterContainer>
                {filters.map((filter) => (
                  <S.FilterPill
                    key={filter.label}
                    active={activeFilter === filter.label}
                    onClick={() => setActiveFilter(filter.label)}
                  >
                    <S.PlatformIcon className={filter.icon} style={{ marginRight: '6px' }} />
                    {filter.label}
                  </S.FilterPill>
                ))}
              </S.FilterContainer>
            </Flex>
          </Card>
        </S.FeedHeader>

        {feedItems.map((post) => (
          <Card key={post.id} padding="20px">
            <Flex direction="column" gap="8px">
              <S.PlatformBadge>
                <S.PlatformIcon className={post.platformIcon} style={{ fontSize: '10px' }} />
                {post.platform}
              </S.PlatformBadge>
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

              {post.platform === 'Twitter / X' && (
                <Button variant="secondary" style={{ marginTop: '12px', width: 'fit-content' }}>
                  Ver original
                </Button>
              )}

              <S.ActionGroup>
                <S.ActionItem hoverColor="#1d9bf0">
                  <i className="fa-regular fa-comment"></i> {post.stats.replies}
                </S.ActionItem>
                <S.ActionItem hoverColor="#00ba7c">
                  <i className="fa-solid fa-retweet"></i> {post.stats.retweets}
                </S.ActionItem>
                <S.ActionItem hoverColor="#f91880">
                  <i className="fa-regular fa-heart"></i> {post.stats.likes}
                </S.ActionItem>
                <S.ActionItem hoverColor="#1d9bf0">
                  <i className="fa-solid fa-chart-simple"></i> {post.stats.views}
                </S.ActionItem>
              </S.ActionGroup>
            </Flex>
          </Card>
        ))}
      </S.Feed>

      <S.TrendsSidebar className="trends-sidebar">
        <Card padding="0">
          <div style={{ padding: '16px' }}>
            <Typography variant="h3">Em Alta Agora</Typography>
          </div>
          {trends.map((trend) => (
            <S.TrendItem key={trend.title}>
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
                <S.Avatar style={{ backgroundColor: source.color, color: '#fff' }}>
                  <i className={source.icon}></i>
                </S.Avatar>
                <div>
                  <Typography variant="body" style={{ fontWeight: 700, display: 'block' }}>
                    {source.name}
                  </Typography>
                  <S.StatusIndicator>
                    Ativo
                  </S.StatusIndicator>
                  <Typography variant="small" color="#666">
                    {source.status}
                  </Typography>
                </div>
              </S.SourceInfo>
            </S.SourceItem>
          ))}
        </Card>

        <S.TipBox>
          <Typography variant="body" style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>
            💡 Dica
          </Typography>
          <Typography variant="small" color="#666">
            Conecte suas contas reais via API para sincronização em tempo real dos seus feeds e análises personalizadas.
          </Typography>
        </S.TipBox>
      </S.TrendsSidebar>

      <S.ThemeToggle onClick={toggleTheme} title="Alternar Tema">
        <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
      </S.ThemeToggle>
    </S.MainLayout>
  )
}

export default Home
