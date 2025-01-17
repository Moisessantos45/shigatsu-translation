const Mantenimiento = (): JSX.Element => {
  return (
    <div
      style={{
        background: "#20202C",
        color: "#ffffff",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "3em", marginBottom: "0.5em" }}>
        Estamos en mantenimiento
      </h1>
      <p style={{ fontSize: "1.5em", textAlign: "center", maxWidth: "600px" }}>
        Lo sentimos, estamos realizando algunas mejoras en el sitio. Volveremos
        pronto. ¡Gracias por tu paciencia!
      </p>
    </div>
  );
};

export default Mantenimiento;
