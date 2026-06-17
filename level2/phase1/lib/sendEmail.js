const sendEmail=async (email) => {
   await new Promise((resolve)=>{
        setTimeout(resolve,5000)
   })

  console.log("task completed")
}

export default sendEmail