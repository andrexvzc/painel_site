import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@components/common/Typography'
import { Card } from '@components/common/Card'
import { Flex } from '@components/common/Layout'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { ThemeContext } from '@/store/context/ThemeContext'
import { useAuth } from '@store/authStore'
import {
  getPosts,
  getSavedPosts,
  getTopicos,
  getPostsByTopico,
  setSaved,
  setLiked,
  formatContagem,
  ORIGEM_META,
} from '@services/posts'
import * as S from './Home.styles'

const Home = () => {
  const [activeFilter, setActiveFilter] = useState('Tudo')
  const [view, setView] = useState('feed') // 'feed' | 'salvos' | 'topicos'
  const [feedItems, setFeedItems] = useState([])
  const [topicos, setTopicos] = useState([])
  const [selectedTopico, setSelectedTopico] = useState(null)
  const [topicoOrigem, setTopicoOrigem] = useState('Tudo') // filtro de origem dentro de um tópico
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)
  const navigate = useNavigate()
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Iniciais do usuário para o avatar (ex.: "Maria Silva" -> "MS")
  const iniciais = (user?.nome || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

  // Mapeia o nome do filtro para a origem armazenada no banco
  const filterToOrigem = {
    Tudo: undefined,
    Instagram: 'Instagram',
    Twitter: 'Twitter',
    Youtube: 'Youtube',
    Noticia: 'Noticia',
  }

  useEffect(() => {
    let ativo = true
    setLoading(true)
    setError(null)

    // Aba Tópicos sem tema selecionado: carrega a lista de tópicos
    if (view === 'topicos' && !selectedTopico) {
      getTopicos()
        .then((data) => {
          if (ativo) setTopicos(data)
        })
        .catch(() => {
          if (ativo) setError('Não foi possível carregar os tópicos. O servidor está rodando?')
        })
        .finally(() => {
          if (ativo) setLoading(false)
        })
      return () => {
        ativo = false
      }
    }

    // Demais casos: carrega postagens (feed, salvos ou de um tópico)
    const carregar =
      view === 'salvos'
        ? getSavedPosts()
        : view === 'topicos'
          ? getPostsByTopico(selectedTopico, filterToOrigem[topicoOrigem])
          : getPosts(filterToOrigem[activeFilter])

    carregar
      .then((data) => {
        if (ativo) setFeedItems(data)
      })
      .catch(() => {
        if (ativo) setError('Não foi possível carregar as postagens. O servidor está rodando?')
      })
      .finally(() => {
        if (ativo) setLoading(false)
      })

    return () => {
      ativo = false
    }
  }, [activeFilter, view, selectedTopico, topicoOrigem])

  // Curte ou descurte uma postagem, atualizando o contador retornado pelo servidor
  const handleToggleLike = async (post) => {
    const novoCurtido = !post.curtido
    try {
      const res = await setLiked(post.id, novoCurtido)
      setFeedItems((itens) =>
        itens.map((p) =>
          p.id === post.id ? { ...p, curtido: res.curtido, curtidas: res.curtidas } : p
        )
      )
    } catch {
      setError('Não foi possível curtir a postagem.')
    }
  }

  // Salva ou remove uma postagem dos salvos
  const handleToggleSave = async (post) => {
    const novoSalvo = !post.salvo
    try {
      await setSaved(post.id, novoSalvo)
      setFeedItems((itens) => {
        // Na aba "Salvos", remove o card ao desfavoritar
        if (view === 'salvos' && !novoSalvo) {
          return itens.filter((p) => p.id !== post.id)
        }
        return itens.map((p) => (p.id === post.id ? { ...p, salvo: novoSalvo ? 1 : 0 } : p))
      })
    } catch {
      setError('Não foi possível salvar a postagem.')
    }
  }

  const sidebarItems = [
    { label: 'Feed', icon: 'fa-solid fa-house', view: 'feed', filter: 'Tudo' },
    { label: 'Em Alta', icon: 'fa-solid fa-fire' },
    { label: 'Instagram', icon: 'fa-brands fa-instagram', view: 'feed', filter: 'Instagram' },
    { label: 'Twitter / X', icon: 'fa-brands fa-twitter', view: 'feed', filter: 'Twitter' },
    { label: 'YouTube', icon: 'fa-brands fa-youtube', view: 'feed', filter: 'Youtube' },
    { label: 'Notícias', icon: 'fa-solid fa-newspaper', view: 'feed', filter: 'Noticia' },
    { label: 'Tópicos', icon: 'fa-solid fa-hashtag', view: 'topicos' },
    { label: 'Salvos', icon: 'fa-solid fa-bookmark', view: 'salvos' },
    { label: 'Notificações', icon: 'fa-solid fa-bell' },
  ]

  // Navegação da sidebar: define a view e, para origens, o filtro do feed
  const handleSidebarClick = (item) => {
    setSelectedTopico(null)
    setTopicoOrigem('Tudo')
    if (item.view === 'salvos') {
      setView('salvos')
    } else if (item.view === 'topicos') {
      setView('topicos')
    } else if (item.view === 'feed') {
      setView('feed')
      setActiveFilter(item.filter)
    }
  }

  const isSidebarActive = (item) => {
    if (item.view === 'salvos') return view === 'salvos'
    if (item.view === 'topicos') return view === 'topicos'
    if (item.view === 'feed') return view === 'feed' && activeFilter === item.filter
    return false
  }

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
    { label: 'Tudo', value: 'Tudo', icon: 'fa-solid fa-border-all' },
    { label: 'Instagram', value: 'Instagram', icon: 'fa-brands fa-instagram' },
    { label: 'Twitter / X', value: 'Twitter', icon: 'fa-brands fa-twitter' },
    { label: 'YouTube', value: 'Youtube', icon: 'fa-brands fa-youtube' },
    { label: 'Notícias', value: 'Noticia', icon: 'fa-solid fa-newspaper' },
  ]

  return (
    <S.MainLayout>
      <S.Sidebar className="main-sidebar">
        <Typography variant="h2" style={{ padding: '0 16px', marginBottom: '16px' }}>
          Painel+
        </Typography>
        {sidebarItems.map((item) => {
          const active = isSidebarActive(item)
          return (
            <S.SidebarItem
              key={item.label}
              active={active}
              onClick={() => handleSidebarClick(item)}
            >
              <S.PlatformIcon className={item.icon} />
              <Typography variant="body" style={{ fontWeight: active ? 700 : 400 }}>
                {item.label}
              </Typography>
            </S.SidebarItem>
          )
        })}
        
        <S.ProfileSection>
          <S.Avatar>{iniciais}</S.Avatar>
          <div style={{ overflow: 'hidden' }}>
            <Typography variant="body" style={{ fontWeight: 700 }}>
              {user?.nome || 'Você'}
            </Typography>
            <Typography variant="small" color="#666">
              {user?.email}
            </Typography>
          </div>
          <S.LogoutButton onClick={handleLogout} title="Sair">
            <i className="fa-solid fa-right-from-bracket"></i>
          </S.LogoutButton>
        </S.ProfileSection>
      </S.Sidebar>

      <S.Feed>
        <S.FeedHeader>
          <Card padding="16px">
            {view === 'salvos' ? (
              <Flex align="center" gap="8px">
                <i className="fa-solid fa-bookmark" style={{ color: '#f7b500' }}></i>
                <Typography variant="h3" style={{ margin: 0 }}>
                  Postagens salvas
                </Typography>
              </Flex>
            ) : view === 'topicos' ? (
              selectedTopico ? (
                <Flex align="center" gap="12px" style={{ flexWrap: 'wrap' }}>
                  <S.BackButton onClick={() => setSelectedTopico(null)} title="Voltar aos tópicos">
                    <i className="fa-solid fa-arrow-left"></i>
                  </S.BackButton>
                  <i className="fa-solid fa-hashtag" style={{ color: '#1d9bf0' }}></i>
                  <Typography variant="h3" style={{ margin: 0 }}>
                    {selectedTopico}
                  </Typography>
                  <S.FilterContainer style={{ marginTop: 0, marginLeft: '4px' }}>
                    {filters.map((filter) => (
                      <S.FilterPill
                        key={filter.value}
                        active={topicoOrigem === filter.value}
                        onClick={() => setTopicoOrigem(filter.value)}
                      >
                        <S.PlatformIcon className={filter.icon} style={{ marginRight: '6px' }} />
                        {filter.label}
                      </S.FilterPill>
                    ))}
                  </S.FilterContainer>
                </Flex>
              ) : (
                <Flex direction="column" gap="4px">
                  <Flex align="center" gap="8px">
                    <i className="fa-solid fa-hashtag" style={{ color: '#1d9bf0' }}></i>
                    <Typography variant="h3" style={{ margin: 0 }}>
                      Explorar Tópicos
                    </Typography>
                  </Flex>
                  <Typography variant="small" color="#666">
                    Escolha um tema para ver todas as postagens relacionadas
                  </Typography>
                </Flex>
              )
            ) : (
              <Flex direction="column" gap="12px">
                <Input
                  placeholder="Buscar posts, pessoas, hashtags..."
                  style={{ marginBottom: 0 }}
                />
                <S.FilterContainer>
                  {filters.map((filter) => (
                    <S.FilterPill
                      key={filter.value}
                      active={activeFilter === filter.value}
                      onClick={() => setActiveFilter(filter.value)}
                    >
                      <S.PlatformIcon className={filter.icon} style={{ marginRight: '6px' }} />
                      {filter.label}
                    </S.FilterPill>
                  ))}
                </S.FilterContainer>
              </Flex>
            )}
          </Card>
        </S.FeedHeader>

        {loading && (
          <Card padding="20px">
            <Typography variant="body" color="#666">
              Carregando postagens...
            </Typography>
          </Card>
        )}

        {error && (
          <Card padding="20px">
            <Typography variant="body" color="#dc3545">
              {error}
            </Typography>
          </Card>
        )}

        {!loading && !error && view === 'topicos' && !selectedTopico && (
          <S.TopicGrid>
            {topicos.map((t) => (
              <S.TopicCard
                key={t.nome}
                onClick={() => {
                  setTopicoOrigem('Tudo')
                  setSelectedTopico(t.nome)
                }}
              >
                <S.TopicName>
                  <i className="fa-solid fa-hashtag" style={{ marginRight: '6px', color: '#1d9bf0' }} />
                  {t.nome}
                </S.TopicName>
                <S.TopicCount>{t.total} posts</S.TopicCount>
              </S.TopicCard>
            ))}
          </S.TopicGrid>
        )}

        {!loading && !error && !(view === 'topicos' && !selectedTopico) && feedItems.length === 0 && (
          <Card padding="20px">
            <Typography variant="body" color="#666">
              {view === 'salvos'
                ? 'Nenhuma postagem salva ainda. Clique em "Salvar" em um post.'
                : 'Nenhuma postagem encontrada para este filtro.'}
            </Typography>
          </Card>
        )}

        {!loading &&
          !error &&
          !(view === 'topicos' && !selectedTopico) &&
          feedItems.map((post) => {
            const meta = ORIGEM_META[post.origem] || {}
            return (
              <Card key={post.id} padding="20px">
                <Flex direction="column" gap="8px">
                  <S.PlatformBadge>
                    <S.PlatformIcon
                      className={meta.icon}
                      color={meta.color}
                      style={{ fontSize: '10px' }}
                    />
                    {meta.label || post.origem}
                  </S.PlatformBadge>
                  <Flex gap="8px" align="center">
                    <Typography variant="body" style={{ fontWeight: 700 }}>
                      {post.autor}
                    </Typography>
                    <Typography variant="small" color="#666">
                      {post.handle}
                    </Typography>
                  </Flex>
                  <Typography variant="body">{post.conteudo}</Typography>

                  {post.imagem && <S.PostImage src={post.imagem} alt="Post content" />}

                  {post.link && (
                    <S.OriginalLink
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary">Ver original</Button>
                    </S.OriginalLink>
                  )}

                  <S.ActionGroup>
                    <S.ActionItem hoverColor="#1d9bf0">
                      <i className="fa-regular fa-comment"></i> {post.replies}
                    </S.ActionItem>
                    <S.ActionItem hoverColor="#00ba7c">
                      <i className="fa-solid fa-retweet"></i> {post.retweets}
                    </S.ActionItem>
                    <S.ActionItem
                      as="button"
                      hoverColor="#f91880"
                      liked={!!post.curtido}
                      onClick={() => handleToggleLike(post)}
                      title={post.curtido ? 'Descurtir' : 'Curtir'}
                    >
                      <i className={`${post.curtido ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>{' '}
                      {formatContagem(post.curtidas)}
                    </S.ActionItem>
                    <S.ActionItem hoverColor="#1d9bf0" title="Visualizações">
                      <i className="fa-regular fa-eye"></i> {post.views}
                    </S.ActionItem>
                    <S.ActionItem
                      as="button"
                      hoverColor="#f7b500"
                      saved={!!post.salvo}
                      onClick={() => handleToggleSave(post)}
                      title={post.salvo ? 'Remover dos salvos' : 'Salvar'}
                    >
                      <i className={`${post.salvo ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i>{' '}
                      {post.salvo ? 'Salvo' : 'Salvar'}
                    </S.ActionItem>
                  </S.ActionGroup>
                </Flex>
              </Card>
            )
          })}
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
