import { 
  Box, 
  Heading, 
  Text, 
  Stack, 
  useColorModeValue,
  Icon,
  Flex,
  Badge
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { IconType } from 'react-icons'

interface FormCardProps {
  title: string
  description: string
  icon: IconType
  to: string
  difficulty: 'Basic' | 'Intermediate' | 'Advanced'
}

export default function FormCard({ title, description, icon, to, difficulty }: FormCardProps) {
  // Badge color based on difficulty
  const getBadgeColorScheme = (level: string): string => {
    switch(level) {
      case 'Basic':
        return 'green'
      case 'Intermediate':
        return 'orange'
      case 'Advanced':
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <Box
      as={RouterLink}
      to={to}
      maxW={'445px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={'lg'}
      rounded={'xl'}
      overflow={'hidden'}
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'all .2s ease-in-out',
        boxShadow: 'xl',
      }}
      transition="all 0.2s ease-in-out"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.600')}
      position="relative"
    >
      <Box h={'100px'} bg={'brand.500'} position="relative">
        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          height={'100%'}
        >
          <Icon
            as={icon}
            w={12}
            h={12}
            color={'white'}
          />
        </Flex>
      </Box>
      
      <Badge 
        variant={'subtle'}
        position="absolute" 
        top="4" 
        right="4" 
        colorScheme={getBadgeColorScheme(difficulty)}
        fontSize="xs"
        textTransform="uppercase"
        fontWeight="bold"
        px="2"
        py="1"
        rounded="md"
      >
        {difficulty}
      </Badge>
      
      <Box p={6}>
        <Stack spacing={3}>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'xl'}
            fontFamily={'body'}>
            {title}
          </Heading>
          <Text 
            color={useColorModeValue('gray.500', 'gray.300')} 
            minH="80px"
            fontSize="sm"
            lineHeight="tall"
          >
            {description}
          </Text>
        </Stack>
      </Box>
    </Box>
  )
}