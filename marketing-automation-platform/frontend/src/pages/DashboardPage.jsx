import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  ListIcon,
  Icon,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import StatCard from '../components/dashboard/StatCard';
import { getDashboardStats, getRecommendations, getRecentActivities } from '../services/dashboardService';

// Importing a few icons from react-icons
import { FiActivity, FiUsers, FiMail, FiClock, FiThumbsUp, FiMessageSquare, FiCalendar } from 'react-icons/fi';
import { MdCheckCircle, MdSettings, MdInfoOutline } from 'react-icons/md';


const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsData, recsData, actsData] = await Promise.all([
          getDashboardStats(),
          getRecommendations(),
          getRecentActivities(),
        ]);
        setStats(statsData);
        setRecommendations(recsData);
        setActivities(actsData);
      } catch (err) {
        setError('Falha ao carregar dados do painel.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 200px)">
        <Spinner size="xl" color="brand.700" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Erro ao carregar
        </AlertTitle>
        <AlertDescription maxWidth="sm">{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box p={{ base: 2, md: 4 }}>
      <Heading as="h1" size="xl" mb="6" color="brand.800">
        Painel Principal
      </Heading>

      {stats && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 5, lg: 8 }} mb="8">
          <StatCard
            title="Campanhas Ativas"
            value={stats.activeCampaigns}
            icon={FiActivity}
            changeType={stats.activeCampaignsChange?.type}
            changeValue={stats.activeCampaignsChange?.value}
            helpText="desde o último mês"
          />
          <StatCard
            title="Total de Clientes"
            value={stats.totalClients}
            icon={FiUsers}
            changeType={stats.totalClientsChange?.type}
            changeValue={stats.totalClientsChange?.value}
            helpText="desde o último mês"
          />
          <StatCard
            title="E-mails Enviados (Mês)"
            value={stats.emailsSentThisMonth}
            icon={FiMail}
          />
          <StatCard
            title="Posts Agendados"
            value={stats.scheduledPosts}
            icon={FiClock}
          />
        </SimpleGrid>
      )}
      
      <Divider my="8" />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 5, lg: 8 }} mb="8">
        <Box p="6" bg={cardBg} shadow="xl" rounded="lg" borderWidth="1px">
          <Heading as="h2" size="lg" mb="4" color="brand.700">
            <Icon as={FiThumbsUp} mr="2" verticalAlign="middle" />
            Recomendações Inteligentes
          </Heading>
          {recommendations.length > 0 ? (
            <List spacing={3}>
              {recommendations.map(rec => (
                <ListItem key={rec.id} color={textColor}>
                  <ListIcon as={rec.type === 'insight' ? MdInfoOutline : rec.type === 'tip' ? MdSettings : MdCheckCircle} color="green.500" />
                  {rec.text}
                </ListItem>
              ))}
            </List>
          ) : (
            <Text color={textColor}>Em breve, nosso assistente de IA fornecerá recomendações personalizadas aqui.</Text>
          )}
        </Box>

        <Box p="6" bg={cardBg} shadow="xl" rounded="lg" borderWidth="1px">
          <Heading as="h2" size="lg" mb="4" color="brand.700">
             <Icon as={FiCalendar} mr="2" verticalAlign="middle" />
            Atividade Recente
          </Heading>
           {activities.length > 0 ? (
            <List spacing={3}>
              {activities.map(act => (
                <ListItem key={act.id} fontSize="sm" color={textColor}>
                   <ListIcon as={FiMessageSquare} color="blue.500" />
                  {act.description} - <Text as="span" color="gray.500">{new Date(act.timestamp).toLocaleDateString()}</Text>
                </ListItem>
              ))}
            </List>
          ) : (
            <Text color={textColor}>Suas últimas atividades e resultados de campanhas aparecerão aqui.</Text>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default DashboardPage;
