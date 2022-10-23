const transport = require("../transport")

const sendEmailNewOrder = (fromEmail, toEmail, order ) => {
  let li = ""
  order.products.forEach(product => {
    li = li + `<li> ${product.title} - quantity: ${product.quantity} </li>`
  }) 
  transport.sendMail({
    from: `Juan ${fromEmail}`,
    to:toEmail,
    html:`<h1>Listado de los items:</h1>
            <ul> 
                ${li}
            </ul>
          <h2> Direccion de envio: ${order.shippingAddress} </h2>
          <h2> Total: ${order.total}$ </h2>`,
    subject:`Nueva compra de usuario: ${order.email}`
}).then((data)=> {
    console.log("Email enviado");
}).catch(console.log)
}

const sendEmailNewUser = (fromEmail, toEmail, user) => {
  transport.sendMail({
    from: `Juan ${fromEmail}`,
    to:toEmail,
    html:`<h1>Nuevo usuario:</h1>
            <ul> 
                <li>Email: ${user.email}</li>
                <li>Nombre: ${user.name}</li>
                <li>Apellido: ${user.surname}</li>
                <li>Tel: ${user.tel}</li>
                <li>Direccion: ${user.address}</li
            </ul>`,
    subject:`Nuevo usuario creado: ${user.email}`
}).then((data)=> {
    console.log("Email enviado!");
}).catch(console.log)
}

module.exports = {sendEmailNewOrder, sendEmailNewUser}