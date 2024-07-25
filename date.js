export function todaysDate() {
  var today = new Date()
  var dd = today.getDate()
  var mm = today.getMonth() + 1
  var yyyy = today.getFullYear()
  if (dd < 10) {
    dd = "0" + dd
  }
  if (mm < 10) {
    mm = "0" + mm
  }
  today = mm + "/" + dd + "/" + yyyy
  return today
}

export function dodgersDateMinusOne() {
  var today = new Date()
  var dd = today.getDate() - 1
  var mm = today.getMonth() + 1
  var yyyy = today.getFullYear()
  if (dd < 10) {
    dd = "0" + dd
  }
  if (mm < 10) {
    mm = "0" + mm
  }
  today = mm + "/" + dd + "/" + yyyy
  return today
}
export function getMonthBoundaries() {
  // Create a date object for the first day of the given month
  var today = new Date()
  var yyyy = today.getFullYear()
  var mm = today.getMonth() + 1
  const firstDay = new Date(yyyy, mm - 1, 1)
  // Create a date object for the last day of the given month
  const lastDay = new Date(yyyy, mm, 0)
  // Format the dates
  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay),
  }
}
