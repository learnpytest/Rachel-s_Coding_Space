import React from "react"

const AlertNode = ({ title, type, children }) => {
  return (
    <div className={`alert alert-${type}`}>
      <h4 className={type}>{title}</h4>
      {children}
    </div>
  )
}

export default AlertNode