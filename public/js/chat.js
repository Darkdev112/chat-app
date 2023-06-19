const socket = io()

//Elements
const inputField = document.querySelector("#field")
const submitBtn = document.querySelector("#btn")
const locationBtn = document.querySelector('#send-location')
const messages = document.querySelector("#messages")

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML


//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix : true})


const autoscroll = () => {
    const newMessage = messages.lastElementChild

    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = messages.offsetHeight

    const containerHeight = messages.scrollHeight

    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight
    }

    console.log(newMessageStyles);
}


submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        submitBtn.setAttribute('disabled', 'disabled')
        socket.emit('sendMessage', inputField.value ,(deliver) => {
            submitBtn.removeAttribute('disabled')
            inputField.value = ''
            inputField.focus()
            console.log(deliver);
        })
})

socket.on('message', (msgs) => {
    const html = Mustache.render(messageTemplate,{
        username : msgs.username,
        message : msgs.text,
        createdAt : moment(msgs.createdAt).format('h : mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
})

locationBtn.addEventListener('click', () => {
    locationBtn.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
        return alert('geolocation is not supported by the browser')
    }

    navigator.geolocation.getCurrentPosition((position) => { 
        socket.emit('sendLocation', {lat : position.coords.latitude, long : position.coords.longitude}, (deliver) => {
            locationBtn.removeAttribute('disabled')
            console.log(deliver);
        })
    })
})

socket.on('location-message',(location) => {
    console.log(location);
    const html = Mustache.render(locationTemplate, {
        username : location.username,
        location : location.url,
        createdAt : moment(location.createdAt).format('h : mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll();
})


socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }

})