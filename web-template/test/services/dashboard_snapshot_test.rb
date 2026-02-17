require "test_helper"

class DashboardSnapshotTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)
    @user.projects.create!(name: "Alpha", status: :active)
    @user.projects.create!(name: "Beta", status: :archived)
  end

  test "builds aggregate counts" do
    payload = DashboardSnapshot.fetch(@user)

    assert_equal 3, payload[:total_projects]
    assert_equal 2, payload[:active_projects]
    assert_equal 1, payload[:archived_projects]
  end

  test "includes recent project names" do
    payload = DashboardSnapshot.fetch(@user)

    assert_includes payload[:recent_project_names], "Alpha"
  end
end
