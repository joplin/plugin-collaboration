const config_ = {
    startPort: 41184 || parseInt(process.env.REACT_APP_CLIPPER_PORT_START)
}

export const config = () => {
    return config_;
}