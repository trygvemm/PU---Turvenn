const useNavigate = jest.fn();
const useLocation = jest.fn();
const useParams = jest.fn();
function Link() {
  return <div>Link</div>;
}
module.exports = { useNavigate, useLocation, useParams, Link };
