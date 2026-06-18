import styled from 'styled-components'

export const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 350px;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: ${props => props.theme.background};
  min-height: 100vh;
  color: ${props => props.theme.text};

  @media (max-width: 1200px) {
    grid-template-columns: 250px 1fr 300px;
    max-width: 1200px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 200px 1fr;
    .trends-sidebar {
      display: none;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    .main-sidebar {
      display: none;
    }
  }
`

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 20px;
  height: calc(100vh - 40px);
`

export const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: ${props => (props.active ? '700' : '400')};
  background-color: ${props => (props.active ? props.theme.sidebarHover : 'transparent')};
  color: ${props => props.theme.text};

  &:hover {
    background-color: ${props => props.theme.sidebarHover};
  }
`

export const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-top: auto;
  border-radius: 9999px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.sidebarHover};
  }
`

export const LogoutButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
  padding: 8px;
  border-radius: 50%;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    color: #dc3545;
    background-color: ${props => props.theme.border};
  }
`

export const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #28a745;
  font-size: 12px;
  font-weight: 600;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #28a745;
  }
`

export const TipBox = styled.div`
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
`

export const PlatformBadge = styled.span`
  background-color: ${props => props.theme.border};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 4px;
  display: inline-block;
`

export const Feed = styled.main`
  display: block;
  column-count: 1;
  column-gap: 16px;

  @media (min-width: 1100px) {
    column-count: 2;
  }

  & > * {
    break-inside: avoid;
    margin-bottom: 16px;
  }
`

export const FeedHeader = styled.div`
  column-span: all;
  margin-bottom: 16px;
`

export const TrendsSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 20px;
  height: fit-content;
`

export const TrendItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${props => props.theme.itemHover};
  }
`

export const SourceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${props => props.theme.itemHover};
  }
`

export const SourceInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.border};
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
`

export const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`

export const FilterPill = styled.div`
  padding: 6px 16px;
  border-radius: 9999px;
  background-color: ${props => (props.active ? props.theme.primary : props.theme.border)};
  color: ${props => (props.active ? '#fff' : props.theme.text)};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${props => (props.active ? props.theme.primary : 'transparent')};

  &:hover {
    background-color: ${props => (props.active ? '#1a8cd8' : props.theme.sidebarHover)};
  }
`

export const PostImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 12px;
  border: 1px solid ${props => props.theme.border};
`

export const ActionGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  max-width: 425px;
  width: 100%;
`

export const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props =>
    props.saved || props.liked
      ? props.hoverColor || props.theme.primary
      : props.theme.textSecondary};
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;

  /* Reset para quando renderizado como <button> (curtir / salvar) */
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-weight: ${props => (props.saved || props.liked ? 600 : 400)};

  &:hover {
    color: ${props => props.hoverColor || props.theme.primary};
  }
`

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.text};
  font-size: 1rem;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.border};
  }
`

// Grade de tópicos: cards menores que os do feed, exibidos em largura total
export const TopicGrid = styled.div`
  column-span: all;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`

export const TopicCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.cardBorder};
  background-color: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;

  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.theme.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`

export const TopicName = styled.span`
  font-weight: 700;
  font-size: 15px;
`

export const TopicCount = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`

export const ThemeToggle = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.theme.primary};
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, background-color 0.2s;
  z-index: 1000;
  font-size: 1.2rem;

  &:hover {
    transform: scale(1.1);
    background-color: #1a8cd8;
  }

  &:active {
    transform: scale(0.95);
  }
`

export const OriginalLink = styled.a`
  display: inline-block;
  width: fit-content;
  margin-top: 12px;
  text-decoration: none;
`

export const PlatformIcon = styled.i`
  margin-right: 8px;
  color: ${props => props.color || 'inherit'};
`

export const StatusText = styled.p`
  margin-top: 12px;
  font-weight: 500;
  color: ${props => (props.active ? '#28a745' : '#dc3545')};
`
