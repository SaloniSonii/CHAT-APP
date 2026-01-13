import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  const {
    messages = [],
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext)

  const { authUser, onlineUsers = [] } = useContext(AuthContext)

  const scrollEnd = useRef(null)
  const [input, setInput] = useState('')

  // ---------------- SEND TEXT MESSAGE ----------------
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    await sendMessage({ text: input.trim() })
    setInput('')
  }

  // ---------------- SEND IMAGE ----------------
  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  // ---------------- FETCH MESSAGES ----------------
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ---------------- EMPTY STATE ----------------
  if (!selectedUser) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} className='max-w-16' alt='' />
        <p className='text-lg font-medium text-white'>
          Chat anytime, anywhere
        </p>
      </div>
    )
  }

  return (
    <div className='h-full relative backdrop-blur-lg'>

      {/* ================= HEADER ================= */}
      <div className='flex items-center gap-3 py-3 px-4 border-b border-stone-500'>
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className='w-8 rounded-full'
          alt=''
        />

        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className='w-2 h-2 rounded-full bg-green-500'></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=''
          className='md:hidden w-6 cursor-pointer'
        />
      </div>

      {/* ================= CHAT AREA ================= */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-auto p-4 gap-2'>
        {messages.map((msg, index) => {
          const isMe = msg.senderId === authUser?._id

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isMe ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* LEFT AVATAR (OTHER USER) */}
              {!isMe && (
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  className='w-7 rounded-full'
                  alt=''
                />
              )}

              {/* MESSAGE */}
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=''
                  className='max-w-[230px] border border-gray-700 rounded-lg'
                />
              ) : (
                <div
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white ${
                    isMe
                      ? 'bg-violet-500/30 rounded-br-none'
                      : 'bg-gray-500/30 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  <p className='text-[10px] text-gray-400 text-right mt-1'>
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              )}

              {/* RIGHT AVATAR (ME) */}
              {isMe && (
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  className='w-7 rounded-full'
                  alt=''
                />
              )}
            </div>
          )
        })}

        <div ref={scrollEnd} />
      </div>

      {/* ================= INPUT AREA ================= */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-black/20'>
        <div className='flex-1 flex items-center bg-gray-100/10 px-3 rounded-full'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
            type='text'
            placeholder='Send a message'
            className='flex-1 text-sm p-3 bg-transparent outline-none text-white placeholder-gray-400'
          />

          <input
            type='file'
            id='image'
            accept='image/png, image/jpeg'
            hidden
            onChange={handleSendImage}
          />

          <label htmlFor='image'>
            <img
              src={assets.gallery_icon}
              alt=''
              className='w-5 mr-2 cursor-pointer'
            />
          </label>
        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=''
          className='w-7 cursor-pointer'
        />
      </div>
    </div>
  )
}

export default ChatContainer
