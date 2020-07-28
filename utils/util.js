/*const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}*/

const biology = [],
      chemistry = [],
      chinese = [],
      computer = [],
      economics = [],
      english = [],
      geography = [],
      history = [],
      math = [],
      others = [],
      physics = [],
      psychology = [],
      book_list = [biology,
                   chemistry,
                   chinese,
                   computer,
                   economics,
                   english,
                   geography,
                   history,
                   math,
                   others,
                   physics,
                   psychology]

module.exports = {
  book_list: book_list
}
