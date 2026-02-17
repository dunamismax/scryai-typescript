class DashboardsController < ApplicationController
  before_action :authenticate_user!

  def show
    @snapshot = DashboardSnapshot.fetch(current_user)
    @projects = policy_scope(Project).recent_first.limit(5)
  end
end
