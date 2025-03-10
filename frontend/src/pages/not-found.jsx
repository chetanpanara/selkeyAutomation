import { Button } from '@/components/ui/button';
import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Button variant="contained" className="mt-4 bg-sky-400 rounded-full font-semibold text-text" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  )
}

export default NotFound;
