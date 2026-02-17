class DashboardSnapshot
  CACHE_VERSION = 1
  EXPIRY = 10.minutes

  class << self
    def fetch(user)
      Rails.cache.fetch(cache_key(user), expires_in: EXPIRY) do
        payload_for(user)
      end
    end

    def refresh(user)
      Rails.cache.write(cache_key(user), payload_for(user), expires_in: EXPIRY)
    end

    private

    def cache_key(user)
      [ "dashboard", "v#{CACHE_VERSION}", user.id ]
    end

    def payload_for(user)
      projects = user.projects

      {
        total_projects: projects.count,
        active_projects: projects.active.count,
        archived_projects: projects.archived.count,
        recent_project_names: projects.recent_first.limit(5).pluck(:name)
      }
    end
  end
end
