'use client'

import { Box, Stack, TextField, Button, Typography, CircularProgress} from "@mui/material"
import { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': 
 {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Base border color
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Hover border color
            },
          },
        },
      },
    },
  },
});

export default function Home() {
  const [history, setHistory] = useState([])
  const firstMessage = "👋 Hi there! I'm Cindy, your personalized college counselor. How can I help?"
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("")

  const sendMessage = async () => {
    setIsLoading(true)
    setHistory((history) => [ ...history, {role: "user", parts: [{text: message}]} ])
    setMessage('')

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify([ ...history, {role: "user", parts: [{text: message}]} ])
      })
  
      const data = await response.json()
      const cleanedResponse = data.trim().replaceAll('*', ' ');
      setHistory((history) => [ ...history, {role: "model", parts: [{text: cleanedResponse}] }])

    } catch (error) {
      console.log("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box bgcolor='black'>
      <Typography bgcolor="black" color="white" variant="h4" sx={{paddingTop: 2}}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}>
        AI College Counselor Cindy
      </Typography>

      <Typography bgcolor="black" color="white" variant="h6" sx={{paddingTop: 2}}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}>
        <Box fontWeight='fontWeightMedium' bgcolor="black" display='inline'>Discover. Plan. Chat.</Box>
      </Typography>

      <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      justifyContent={'center'}
      sx={{paddingTop: 10}}
    >
      <Stack 
        direction={'column'} 
        justifyContent={'flex-end'}
        width={'50%'} 
        height={'80%'} 
        maxHeight={'80%'} 
        border={'2px solid white'} 
        borderRadius={5}
        overflow={'hidden'}
        padding={2}
        marginTop={-4} 
        spacing={3}
      >
        <Stack direction={'column'} spacing={2} overflow={'auto'} mb={2}>
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            bgcolor={'secondary.main'}
            borderRadius={10}
            p={2}
          >
            <Typography
              bgcolor={'secondary.main'}
              color={'white'}
            >
              {firstMessage}
            </Typography>
          </Box>
          {history.map((textObject, index) => (
            <Box
              key={index}
              display={'flex'}
              justifyContent={textObject.role === 'user' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={textObject.role === 'user' ? 'primary.main' : 'secondary.main'}
                color={'white'}
                borderRadius={10}
                p={2}
              >
                {textObject.parts[0].text}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2} width={'80%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <ThemeProvider theme={theme}>
          <TextField InputProps={{ placeholder: 'Ask Cindy', style: { color: "white"}}} value={message} sx={{paddingLeft: 2}} onChange={(e => setMessage(e.target.value))} fullWidth></TextField>
          </ThemeProvider>
          <Button style={{backgroundColor: "white", color: "black"}} variant='contained' size='large' onClick={sendMessage}>Send</Button>
          {isLoading && <CircularProgress />}
        </Stack>
      </Stack>
    </Box>
    </Box>
  );
}

