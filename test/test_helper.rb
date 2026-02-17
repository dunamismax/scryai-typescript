# frozen_string_literal: true

require 'minitest/autorun'
require 'rake'

load File.expand_path('../Rakefile', __dir__) unless Rake::Task.task_defined?('scry:setup:ssh_backup')

module Scry
  module TestHelpers
    def with_env(vars)
      original = {}
      vars.each do |key, value|
        original[key] = ENV.fetch(key, nil)
        value.nil? ? ENV.delete(key) : ENV[key] = value
      end
      yield
    ensure
      vars.each_key do |key|
        original[key].nil? ? ENV.delete(key) : ENV[key] = original[key]
      end
    end
  end
end
