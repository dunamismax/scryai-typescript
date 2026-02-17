require "test_helper"

class DashboardControllerTest < ActionDispatch::IntegrationTest
  test "redirects guests" do
    get dashboard_url

    assert_redirected_to new_user_session_url
  end

  test "renders for signed-in user" do
    sign_in users(:one)

    get dashboard_url

    assert_response :success
    assert_includes response.body, "Recent projects"
  end
end
