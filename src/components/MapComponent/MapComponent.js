

export const MapComponent = () => {
    const API_KEY = "AIzaSyBc78CcptwLCiyEh2VxVdPp0JcKqkJ-1O4"

    const myMap = () => {
        const mapProp= {
            center: new window.google.maps.LatLng(51.508742,-0.120850),
            zoom:5,
          };
        const map = new window.google.maps.Map(document.getElementById("googleMap"),mapProp);

        return map
    }

    return <>
        <div className="googleMap"></div>
        <script src={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${myMap()}`}></script>
    </>
}