class Project < ApplicationRecord
  belongs_to :user

  enum :status, { draft: 0, active: 1, archived: 2 }, default: :draft

  validates :name, presence: true
  validates :summary, length: { maximum: 500 }, allow_blank: true

  after_commit :queue_dashboard_refresh

  scope :recent_first, -> { order(updated_at: :desc) }

  private

  def queue_dashboard_refresh
    DashboardRefreshJob.perform_later(user_id)
  end
end
