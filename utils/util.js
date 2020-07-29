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

const book_list = {
  'ah': {'barron': [3, 4],
         'gardner': [14, 15, 16]
        },
  'bio': {'barron(ap)': [5, 6, 7],
          'barron(sat2)': [1]},
  'calc': {},
  'chem': {},
  'cn': {},
  'cs': {"barron": [7, 8]},
  'econ': {},
  'en': {},
  'es': {},
  'geo': {},
  'math': {},
  'others': {},
  'phys': {},
  'psyc': {},
  'stat': {},
  'uh': {}
},
      sbj_list = ['ah', 'bio', 'calc', 'chem', 'cn', 'cs', 'econ', 'en', 'es',
                  'geo', 'math', 'others', 'phys', 'psyc', 'stat', 'uh'],
      _sbj_list = ['艺术史', '生物', '微积分', '化学', '中文', '计算机', '经济', '英语',
                   '环境科学', '地理', '数学', '其他', '物理', '心理', '统计', '美国历史']

const test = 1

module.exports = {
  book_list: book_list,
  sbj_list: sbj_list,
  _sbj_list: _sbj_list,
  test: test
}
