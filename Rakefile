# frozen_string_literal: true

require 'rake/testtask'

$LOAD_PATH.unshift File.expand_path('lib', __dir__)

Dir.glob('lib/tasks/**/*.rake').each { |r| load r }

Rake::TestTask.new(:test) do |t|
  t.libs << 'test'
  t.pattern = 'test/**/*_test.rb'
  t.warning = true
end
