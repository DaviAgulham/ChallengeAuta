## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the client side and server side

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The server side with the MercadoPago integration is in the [http://localhost:8080](http://localhost:8080)

Remember change the firebase credentials in the path src/config/firebaseConfig

Remember change the acces_token of MercadoPago in the path server/server.js



#######################################################################################

La aplicación debería permitir a los usuarios acceder a un catálogo de autos, que debe almacenarse en Firestore, donde el usuario tenga la posibilidad de:

• Marcar como favorito una unidad

• Consultar sobre la unidad

• Agregar una unidad

• Ver la ficha de la unidad

• Reservar la unidad mediante alguna pasarela de pago

• Cualquier otra interacción que te parezca necesaria también es aceptada


Requisitos

    1. Agregar un vehículo: los usuarios (equipo de operaciones) deberían poder agregar una nueva unidad.
    
    2. Marcar como favorito: los usuarios (consumidores finales) deberían poder ver una lista de todas sus unidades favoritas.
    
    3. Consultar sobre una unidad: los usuarios deberían poder consultar con el equipo de operaciones sobre una unidad
    
    4. Eliminar / Inhabilitar unidades: el equipo de operaciones debería poder eliminar unidades vendidas o inhabilitar unidades reservadas.
    
    5. Aplicar Filtros: el usuario debe tener la posibilidad de aplicar filtros en el catálogo de unidades (utilizando índices desde Firestore) referidos a los autos.
    
    6. Persistir datos: los usuarios deben almacenarse en una base de datos de Firebase, asegurando que no se pierdan datos entre sesiones. El usuario debe loguearse en el sitio dejando sus datos personales (mediante react-hook-form o mediante google).
    
    7. Diseño responsivo: la aplicación debe ser responsiva y funcionar bien tanto en dispositivos móviles como de escritorio.

    8. Manejo de errores: la aplicación debe manejar los errores con elegancia y proporcionar comentarios significativos al usuario (por ejemplo, errores de validación de formularios, estado vacío de la lista de tareas pendientes). Manejar errores en la parte delantera y trasera.


Aclaraciones

   1.Los usuarios con rol "Team" tienen permitido crear usuarios en /add-car, donde pueden ingresar los datos y hacer upload de una imagen de la unidad (se utilizó el bucket/store de firebase para las imagenes).
   
   2.Los usuarios con rol "Consumer" tienen permitido la funcion de marcar como favorita una unidad y tienen el acceso permitido a la pagina /favorites donde pueden ver el listado de sus unidades favoritas.
   
   3.Los usuarios con rol "Consumer" tienen permitido la funcion de consultar sobre una unidad con el equipo, y los usuarios con el rol "Team" tienen el acceso permitido a la pagina /team-queries donde pueden ver el listado de consultas con su estado actual     
   ('pending' | 'resolved') y fecha de consulta.
   
   4.1.Los usuarios con rol "Team" tienen la opcion de reservar imediatamente una unidad.
   
   4.2.Los usuarios con rol "Consumer" pueden reservar una unidad a través del pago exitoso de la seña de 5000 utilizando la pasarela de pago de Mercado Pago(se utilizó el Checkout Pro).
   
   5.Los usuarios pueden aplicar los filtros en la home del sistema.

   6.El usuario al momento de registrarse tiene que ingresar: email, password, dni y rol.
   
   7.El sistema se encuentra totalmente resposivo para dispositivos moviles y escritorio.
   
   8.El sistema maneja los errores de manera amigable y sencilla para el usuario.
   
