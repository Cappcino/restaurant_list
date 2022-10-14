function sortSelector(sortValue) {
  switch (sortValue) {
    case '1':
      return { name: 'asc' }
    case '2':
      return { name: 'desc' }
    case '3':
      return { category: 'asc' }
    case '4':
      return { location: 'asc' }
  }
}

module.exports = sortSelector