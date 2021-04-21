const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"

const users = []
let filteredResults = []
const FRIENDS_PER_PAGE = 24
let friendPage = 1
let mode = 'card'
const dataPanel = document.querySelector('#data-panel')
const friendModal = document.querySelector('#friend-modal')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const changeMode = document.querySelector('#icon-change-mode')

//卡片模式
function renderFriendCard(data) {
  let rawHTML = ""
  data.forEach((item) => {
    rawHTML += `
   <div class="col-sm-3">
    <div class="mt-3 mb-2">
     <div class="card">
       <div class="card-body" >
         <img src="${item.avatar}" class="card-img-top img " alt="avatar">
           <h5 class="card-title d-flex justify-content-center">${item.name}</h5>
           <div class="card-footer d-flex justify-content-center">
                <button class="btn btn-outline-primary  btn-md mr-2 btn-show-friend" data-toggle="modal"
                  data-target="#friend-modal" data-id="${item.id}">More</button>
                <button class="btn btn-md btn-outline-danger btn-add-favorite " data-id="${item.id}">+</button>
              </div>
       </div>
     </div>
    </div>
  </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}
//清單模式
function renderFriendList(data) {
  let rawHTML = '<ul class="list-group w-100 mt-3 mb-2">'
  data.forEach((item) => {
    rawHTML += `
    <li class = "list-group-item d-flex justify-content-between align-items-center">
            <span><img src="${item.avatar}" class="img-list"> ${item.name} ${item.surname}</span>
            <span>
               <button class="btn btn-primary btn-show-friend" data-toggle="modal" data-target="#friend-modal" data-id="${item.id}">More</button>
               <button class="btn btn-danger btn-add-favorite" data-id="${item.id}">+</button>
            </span>
          </li>
    `
  })
  rawHTML += `</ul>`
  dataPanel.innerHTML = rawHTML
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


function renderPaginator(amount) {
  const numberPage = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ""
  for (let page = 1; page <= numberPage; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}


function getPage(page) {
  const data = filteredResults.length ? filteredResults : users
  const startIndex = (page - 1) * FRIENDS_PER_PAGE
  return data.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}

function addFavorite(id) {
  const favoriteList = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const user = users.find((user) => user.id === id)
  if (favoriteList.some((user) => user.id === id)) {
    return alert('已在此清單中')
  }

  favoriteList.push(user)
  alert('成功加入清單內!')
  localStorage.setItem('favoriteFriends', JSON.stringify(favoriteList))
}


function displayDataList() {
  mode === 'card' ? renderFriendCard(getPage(friendPage)) : renderFriendList(getPage(friendPage))
}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-friend')) {
    showFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('input', function onSearchFormInputed(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredResults = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )
  if (filteredResults.length === 0) {
    alert(`您輸入的關鍵字: ${keyword} 沒有搜尋到相關的朋友`)
    filteredResults = users
    searchInput.value = ''
  }
  renderPaginator(filteredResults.length)
  renderFriendCard(getPage(1))
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  friendPage = Number((event.target.dataset.page))
  displayDataList()
})

changeMode.addEventListener("click", function onChangeModeClicked(event) {
  const target = event.target
  if (target.matches("#list-mode")) {
    mode = 'list'
  } else if (target.matches("#card-mode")) {
    mode = 'card'
  }
  displayDataList()
})



axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results)
  renderPaginator(users.length)
  displayDataList()
})
  .catch((err) => console.log(err))