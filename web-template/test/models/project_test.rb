require "test_helper"

class ProjectTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  setup do
    @user = users(:one)
  end

  test "is invalid without a name" do
    project = Project.new(user: @user, status: :draft)

    assert_not project.valid?
    assert_includes project.errors[:name], "can't be blank"
  end

  test "supports enum status" do
    project = Project.new(name: "Demo", user: @user)

    assert_equal "draft", project.status
  end

  test "enqueues dashboard refresh after commit" do
    assert_enqueued_with(job: DashboardRefreshJob, args: [ @user.id ]) do
      Project.create!(name: "Refresh", summary: "Queue check", user: @user)
    end
  end
end
