const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"

const users = JSON.parse(localStorage.getItem('favoriteFriends'))

const dataPanel = document.querySelector('#data-panel')
const favoriteFriend = document.querySelector('#favorite-friend')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const changeMode = document.querySelector('#icon-change-mode')


function renderFriendList(data) {
  let rawHTML = ""
  data.forEach((item) => {
    rawHTML += `
   <div class="col-sm-3">
    <div class="mt-3 mb-2 ">
     <div class="card">
       <div class="card-body" >
         <img src="${item.avatar}" class="card-img-top img " alt="avatar">
           <h5 class="card-title d-flex justify-content-center">${item.name}</h5>
           <div class="card-footer d-flex justify-content-center">
                <button class="btn btn-primary btn-md mr-2 btn-show-friend" data-toggle="modal"
                  data-target="#friend-modal" data-id="${item.id}">More</button>
                <button class="btn btn-danger btn-md btn-remove-favorite" data-id="${item.id}">X</button>
              </div>
       </div>
     </div>
    </div>
  </div>
    `
  })
  dataPanel.innerHTML = rawHTML;
}

function showFriendModal(id) {
  const modalImage = document.querySelector("#friend-modal-image")
  const modalName = document.querySelector("#friend-modal-name")
  const modalEmail = document.querySelector("#friend-modal-email")
  const modalGender = document.querySelector("#friend-modal-gender")
  const modalAge = document.querySelector("#friend-modal-age")
  const modalRegion = document.querySelector("#friend-modal-region")
  const modalBirthday = document.querySelector("#friend-modal-birthday")

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    modalImage.innerHTML = `<img src="${data.avatar}" alt="friend-avatar"  class="img-fluid">`
    modalName.innerText = `${data.name} ${data.surname}`
    modalEmail.innerText = `email: ${data.email}`
    modalGender.innerText = `gender: ${data.gender}`
    modalAge.innerText = `age: ${data.age}`
    modalRegion.innerText = `region: ${data.region}`
    modalBirthday.innerText = `birthday: ${data.birthday}`
  })
}

function removeFavorite(id) {
  if (!users) return
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteFriends', JSON.stringify(users))
  renderFriendList(users)
}

dataPanel.addEventListener('click', function onePanelClicked(event) {
  if (event.target.matches('.btn-show-friend')) {
    showFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(event.target.dataset.id))
  }
})

renderFriendList(users)