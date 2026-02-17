require "test_helper"

class DashboardRefreshJobTest < ActiveJob::TestCase
  test "updates cached snapshot for user" do
    user = users(:one)
    user.projects.create!(name: "Async update", status: :active)

    DashboardRefreshJob.perform_now(user.id)

    payload = Rails.cache.read([ "dashboard", "v1", user.id ])

    assert_equal user.projects.count, payload[:total_projects]
  end
end
