import React from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const LoginPage = () => {
  const [currState, setCurrState] = React.useState('Signup') // login | signup
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [bio, setBio] = React.useState('')
  const [isDataSubmited, setIsDataSubmited] = React.useState(false)

  const {login}=React.useContext(AuthContext);

  const handleOnSubmit = e => {
    e.preventDefault()
    if (currState === 'Signup' && !isDataSubmited) {
      setIsDataSubmited(true)
      return
    }
    login(currState==="Signup"?'signup':'login',{fullName,email,password,bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* Left Side */}
      <img src={assets.logo_big} className='w-[min(30vw,250px)]'></img>
      {/* Right Side */}
      <form
        onSubmit={handleOnSubmit}
        className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'
      >
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmited && (
            <img
              onClick={() => setIsDataSubmited(false)}
              src={assets.arrow_icon}
              alt=''
              className='w-5 cursor-pointer'
            ></img>
          )}
        </h2>
        {currState === 'Signup' && !isDataSubmited && (
          <input
            onChange={e => setFullName(e.target.value)}
            value={fullName}
            type='text'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Fullname'
            required
          ></input>
        )}
        {!isDataSubmited && (
          <>
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              type='email'
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Email Address'
              required
            ></input>
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              type='password'
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Password'
              required
            ></input>
          </>
        )}
        {currState === 'Signup' && isDataSubmited && (
          <textarea
            rows={4}
            onChange={e => setBio(e.target.value)}
            value={bio}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Provide a short bio...'
            required
          ></textarea>
        )}

        <button
          type='submit'
          className='py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {currState === 'Signup' ? 'Create Account' : 'Login now'}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type='checkbox'></input>
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className='flex  gap-2'>
          {currState === 'Signup' ? (
            <>
              <p className='text-sm text-gray-600'>Already have an account?</p>
              <span
                onClick={() => setCurrState('Login')}
                className='font-medium text-violet-500 cursor-pointer'
              >
                Login here
              </span>
            </>
          ) : (
            <>
              <p className='text-sm text-gray-600'>Create an account</p>
              <span
                onClick={() => setCurrState('Signup')}
                className='font-medium text-violet-500 cursor-pointer'
              >
                Click here
              </span>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
