import React from 'react';
import { Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Icon, Flex } from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'; // Example icons

const StatCard = ({ title, value, icon, changeType, changeValue, helpText }) => {
  return (
    <Stat
      px={{ base: 4, md: 6 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={'gray.200'}
      rounded={'lg'}
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <StatLabel fontWeight={'medium'} isTruncated color="gray.500">
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'bold'} color="brand.700">
            {value}
          </StatNumber>
          {changeValue && (
            <StatHelpText>
              <StatArrow type={changeType === 'increase' ? 'increase' : 'decrease'} />
              {changeValue}
              {helpText && ` ${helpText}`}
            </StatHelpText>
          )}
        </Box>
        {icon && (
          <Box
            my={'auto'}
            color={'brand.700'}
            alignContent={'center'}
          >
            <Icon as={icon} w={10} h={10} />
          </Box>
        )}
      </Flex>
    </Stat>
  );
};

export default StatCard;
