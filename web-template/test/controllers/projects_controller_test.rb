require "test_helper"

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @owned_project = projects(:one)
    @other_project = projects(:two)
    @user = users(:one)
  end

  test "redirects guests to sign in" do
    get projects_url

    assert_redirected_to new_user_session_url
  end

  test "shows only signed in user projects" do
    sign_in @user

    get projects_url

    assert_response :success
    assert_includes response.body, @owned_project.name
    assert_not_includes response.body, @other_project.name
  end

  test "creates project for current user" do
    sign_in @user

    assert_difference("Project.count") do
      post projects_url, params: { project: { name: "New", summary: "Summary", status: "active" } }
    end

    assert_equal @user, Project.last.user
  end

  test "blocks access to project owned by another user" do
    sign_in @user

    get project_url(@other_project)

    assert_redirected_to projects_url
    follow_redirect!

    assert_includes response.body, "not allowed"
  end
end
