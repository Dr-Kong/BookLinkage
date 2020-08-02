function format_time(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [month, day, year].map(format_number).join('/') + '_' + [hour, minute, second].map(formatNumber).join(':')
}

function format_number(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const pub_list = ['', 'barron', 'cambridge', 'hease', 'hodder', 'mcgraw', 'oxford', '新东方'],
      sbj_list = ['art history', 'biology', 'calculus', 'chemistry', 'chinese', 'computer science',
                  'economics', 'english', 'environmental science', 'geograph', 'mathematics',
                  'others', 'physics', 'psychology', 'statistics', 'tok', 'united states history'],
      _sbj_list = ['艺术史', '生物', '微积分', '化学', '中文', '计算机', '经济', '英语',
                   '环境科学', '地理', '数学', '其他', '物理', '心理', '统计', '知识论', '美国历史']

module.exports = {
  pub_list: pub_list,
  sbj_list: sbj_list,
  _sbj_list: _sbj_list,
  format_time: format_time
}