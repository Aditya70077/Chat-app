import React from 'react';
import { Box } from "@chakra-ui/layout"
import { CloseIcon } from '@chakra-ui/icons';

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="purple"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
     <div>{user.name}</div>
     <span>
      <CloseIcon p={1}/>
     </span>
     

    </Box>
  )
}

export default UserBadgeItem